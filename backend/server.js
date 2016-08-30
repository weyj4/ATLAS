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

var projection = new SphericalMercator({
    size: 256
});

app.get('/test_layer/:z/:x/:y.geojson', function(req, res){

    // Compute the bounding box of the supplied coordinates
    var tile = {}
    tile.bounds = projection.bbox(req.params.x, req.params.y, req.params.z, false, '900913');
    tile.bbox = [
      'ST_SetSRID(',
        'ST_MakeBox2D(',
          'ST_MakePoint(', tile.bounds[0], ', ', tile.bounds[1], '), ',
          'ST_MakePoint(', tile.bounds[2], ', ', tile.bounds[3], ')',
        '), ',
        '3857',
      ')'
    ].join('');
    tile.bbox_4326 = 'ST_Transform('+tile.bbox+', 4326)';
    tile.geom_hash = 'Substr(MD5(ST_AsBinary(the_geom)), 1, 10)';

    //Get all polygons that intersect with the bounding box
    var q = util.format('SELECT json_build_object(\'type\', \'Feature\', \'id\', gid, \'geometry\', ' + 
                        'ST_AsGeoJSON(geom), \'properties\', json_build_object(\'risk_zone\', risk_zone, ' + 
                        '\'pop10\', pop10)) as the_geom_geojson FROM polygons WHERE ST_Intersects(geom, %s);', tile.bbox_4326)
    db.query(q).then(function(data){
        for(var i = 0; i < data.rows.length; i++){
            data.rows[i] = data.rows[i].the_geom_geojson;
            data.rows[i].geometry = JSON.parse(data.rows[i].geometry)
        }
        console.log('Serving ' + data.rows.length + ' polygons')
        res.json({type : 'FeatureCollection', features : data.rows})
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
    console.log('Listening at http://localhost:8082');
});
