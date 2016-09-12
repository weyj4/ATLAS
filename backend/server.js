var express = require('express')
var path = require('path');
require('dotenv').config({silent : true});
var pg = require('pg')
var request = require('request')
var cors = require('cors')
var util = require('util')
var SphericalMercator = require('sphericalmercator');
var _ = require('underscore')

var config = _.extend({database : 'atlas'}, process.env.AWS_IP ? {
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.AWS_IP,
    port : +process.env.DB_PORT
} : {})

var db = new pg.Client(config)

db.connect();

var app = express()
app.use(cors());

// Serve static files from the Node.js server for now...
app.use(express.static(__dirname + '/../static/'));

var projection = new SphericalMercator({
    size: 256
});

app.get('/test_layer/:z/:x/:y.geojson', function(req, res){

    // Compute the bounding box of the supplied coordinates
    var tile = {}
    tile.bounds = projection.bbox(req.params.x, req.params.y, req.params.z, false, '900913');
    tile.bbox = `ST_SetSRID(ST_MakeBox2D(ST_MakePoint(${tile.bounds[0]},${tile.bounds[1]}), 
ST_MakePoint(${tile.bounds[2]}, ${tile.bounds[3]})), 3857)`
    tile.bbox_4326 = `ST_Transform(${tile.bbox}, 4326)`;
    tile.geom_hash = 'Substr(MD5(ST_AsBinary(the_geom)), 1, 10)';

    var q = `SELECT array_to_json(array_agg(row_to_json(feature))) FROM 
(SELECT 'Feature' as type, gid, ST_AsGeoJSON(geom)::json as geometry,
json_build_object('zika_risk', zika_risk, 'pop_per_sq_km', pop_per_sq_km) as properties
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

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";


app.listen(port, ip, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log(`Listening at http://${ip}:${port}`);
});
