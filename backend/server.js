var express = require('express')
var path = require('path');
require('dotenv').config({silent : true});
var pg = require('pg')
var request = require('request')
var cors = require('cors')
var util = require('util')
var SphericalMercator = require('sphericalmercator');
var _ = require('underscore')
var turf = require('turf')
var topojson = require('topojson')
var textbelt = require('textbelt');
//var spawn = require('child_process').spawn;
var exec = require('child_process').exec
//import {spawn, exec} from 'child_process';

var config = _.extend({database : 'atlas'}, process.env.AWS_IP ? {
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.AWS_IP,
    port : +process.env.DB_PORT
} : {})

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";

var db = new pg.Client(config)
db.connect();

var app = express()
app.use(cors());

// Serve static files from the Node.js server for now...
app.use(express.static(__dirname + '/../static/'));

var projection = new SphericalMercator({
    size: 256
});

// Compute the bounding box of a tile
function getBBox(x, y, z){
    var tile = {}
    tile.bounds = projection.bbox(x, y, z, false, '900913');
    tile.bbox = `ST_SetSRID(ST_MakeBox2D(ST_MakePoint(${tile.bounds[0]},${tile.bounds[1]}), 
ST_MakePoint(${tile.bounds[2]}, ${tile.bounds[3]})), 3857)`
    tile.bbox_4326 = `ST_Transform(${tile.bbox}, 4326)`;
    tile.geom_hash = 'Substr(MD5(ST_AsBinary(the_geom)), 1, 10)';
    return tile;
}

//Zika Layer
app.get('/zika_layer/:z/:x/:y.geojson', function(req, res){    
    var IJOIN='(SELECT p.*, value as pop, dpmp FROM colombian_municipalities AS p LEFT JOIN colombian_pop pop ON p.dpto=pop.dpt AND p.mpio=pop.mpio) p'

    var tile = getBBox(req.params.x, req.params.y, req.params.z);

    var q = `SELECT array_to_json(array_agg(row_to_json(feature))) FROM
                (
                    SELECT 'Feature' as type, 
                            gid, 
                            ST_AsGeoJSON(geom)::json as geometry,
                            json_build_object(  
                                'pop', p.pop,
                                'department', p.department,
                                'municipality', p.municipality,
                                'date', report_date,
                                'confirmed_clinic', zika_confirmed_clinic,
                                'confirmed_lab', zika_confirmed_laboratory,
                                'suspected', zika_suspected
                            ) as properties FROM ${IJOIN} LEFT JOIN (
                                SELECT * FROM zika WHERE report_date='${req.query.date}'
                            ) zika ON p.dpmp=zika.id WHERE ST_Intersects(geom, ${tile.bbox_4326})
                )feature;`

    console.log(q)
    db.query(q).then(function(data){
        var features = data.rows[0].array_to_json ? data.rows[0].array_to_json : [];
        console.log('Serving ' + features.length + ' polygons');
        res.json({type : 'FeatureCollection', features : features})
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/HighestRisk', function(req, res){
    var query = `SELECT ST_AsGeoJSON(geom)::json as geometry FROM polygons WHERE polygons.blockid10=
                 (SELECT blockid10 FROM florida_zika WHERE care_delivery=False AND zika_risk=true
                  ORDER BY pop_per_sq_km DESC LIMIT 1);`
    db.query(query).then(function(result){
        var geometry = result.rows[0].geometry
        var centroid = turf.centroid(geometry)
        res.json(centroid.geometry.coordinates)
    })
})

app.get('/water_layer/:z/:x/:y.geojson', function(req, res){
    console.log(`http://${ip}:${port}/water_layer/${req.params.z}/${req.params.x}/${req.params.y}.geojson`)

    var tile = getBBox(req.params.x, req.params.y, req.params.z);
    var q = `SELECT array_to_json(array_agg(row_to_json(feature))) FROM 
(SELECT 'Feature' as type, gid, ST_AsGeoJSON(geom)::json as geometry,
json_build_object('name', gnis_name) as properties
FROM florida_waterbodies as p WHERE gnis_name IS NOT NULL AND ST_Intersects(geom, ${tile.bbox_4326}))feature;`

    //console.log(q)
    db.query(q).then(function(data){
        var features = data.rows[0].array_to_json ? data.rows[0].array_to_json : [];
        console.log('Serving ' + features.length + ' polygons');
        res.json({type : 'FeatureCollection', features : features})
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/test_layer/:z/:x/:y.geojson', function(req, res){

    if(req.params.z <= 13){//too far away
        res.json({
            type : 'FeatureCollection', features : []
        })
        return
    }

    console.log(`http://${ip}:${port}/test_layer/${req.params.z}/${req.params.x}/${req.params.y}.geojson`)

    var tile = getBBox(req.params.x, req.params.y, req.params.z);
    var q = `SELECT array_to_json(array_agg(row_to_json(feature))) FROM 
(SELECT 'Feature' as type, gid, ST_AsGeoJSON(geom)::json as geometry,
json_build_object('zika_risk', zika_risk, 'pop_per_sq_km', pop_per_sq_km, 'care_delivery', care_delivery) as properties
FROM polygons as p INNER JOIN florida_zika as f ON p.blockid10=f.blockid10 WHERE ST_Intersects(geom, ${tile.bbox_4326}))feature;`

    //console.log(q)
    db.query(q).then(function(data){
        var features = data.rows[0].array_to_json ? data.rows[0].array_to_json : [];
        console.log('Serving ' + features.length + ' polygons');
        res.json({type : 'FeatureCollection', features : features})
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/test_layer/:z/:x/:y.topojson', function(req, res){

    console.log(`http://${ip}:${port}/test_layer/${req.params.z}/${req.params.x}/${req.params.y}.topojson`)
    var tile = getBBox(req.params.x, req.params.y, req.params.z);

    var q = `SELECT array_to_json(array_agg(row_to_json(feature))) FROM 
(SELECT 'Feature' as type, gid, ST_AsGeoJSON(geom)::json as geometry,
json_build_object('zika_risk', zika_risk, 'pop_per_sq_km', pop_per_sq_km, 'care_delivery', care_delivery) as properties
FROM polygons as p INNER JOIN florida_zika as f ON p.blockid10=f.blockid10 WHERE ST_Intersects(geom, ${tile.bbox_4326}))feature;`

    //console.log(q)
    db.query(q).then(function(data){
        var features = data.rows[0].array_to_json ? data.rows[0].array_to_json : [];
        console.log('Serving ' + features.length + ' polygons');
        res.json(topojson.topology({collection : {type : 'FeatureCollection', features : features}}))
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/GetZikaDates', function(req, res){
    db.query('SELECT DISTINCT report_date FROM zika ORDER BY report_date;').then((data) => {
        res.json(data.rows.map((x) => new Date(x.report_date).toDateString()));
    }).catch((err) => {
        console.log(err);
    })
})

app.get('/Email', function(req, res){
    var address = req.query.address;
    var text = req.query.text;
    console.log(`echo "${text}" | mutt -s "Message from ATLAS" ${address}`)
    exec(`echo "${text}" | mutt -s "Message from ATLAS" ${address}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    })
})

app.get('/Text', function(req, res){
    var number = req.query.number;
    var text = req.query.text;
    console.log(`Sending ${number}: ${text}`)
    textbelt.sendText(number, text, function(err){
        if(err){
            console.log(err);
        }
    })
})

app.listen(port, ip, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log(`Listening at http://${ip}:${port}`);
});
