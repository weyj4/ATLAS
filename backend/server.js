var express = require('express')
var path = require('path')
require('dotenv').config({silent: true})
var pg = require('pg')
var request = require('request')
var cors = require('cors')
var util = require('util')
var SphericalMercator = require('sphericalmercator')
var _ = require('underscore')
var turf = require('turf')
var topojson = require('topojson')
var textbelt = require('textbelt')
var topojson = require('topojson')
var MBTiles = require('mbtiles')

// var spawn = require('child_process').spawn
var exec = require('child_process').exec
// import {spawn, exec} from 'child_process'

var config = _.extend({database: 'atlas'}, process.env.AWS_IP ? {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.AWS_IP,
  port: +process.env.DB_PORT
} : {})

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

var db = new pg.Client(config)
db.connect()

var app = express()
app.use(cors())

// Serve static files from the Node.js server for now...
app.use(express.static(__dirname + '/../static/'))

var projection = new SphericalMercator({
  size: 256
})

// Compute the bounding box of a tile
function getBBox (x, y, z) {
  var tile = {}
  tile.bounds = projection.bbox(x, y, z, false, '900913')
  tile.bbox = `ST_SetSRID(ST_MakeBox2D(ST_MakePoint(${tile.bounds[0]},${tile.bounds[1]}), 
ST_MakePoint(${tile.bounds[2]}, ${tile.bounds[3]})), 3857)`
  tile.bbox_4326 = `ST_Transform(${tile.bbox}, 4326)`
  tile.geom_hash = 'Substr(MD5(ST_AsBinary(the_geom)), 1, 10)'
  return tile
}

/*
new MBTiles(path.join(__dirname, 'pop.mbtiles'), (err, mbtiles) => {
  if (err) {
    throw err
  }else {
    app.get('/pop_mb/:z/:x/:y.png', (req, res) => {
      mbtiles.getTile(req.params.z, req.params.x, req.params.y, function (err, tile, headers) {
        if (err) {
          console.log(err)
          res.status(404).send('Tile rendering error: ' + err + '\n')
        } else {
          res.header('Content-Type', 'image/png')
          res.send(tile)
        }
      })
    })
  }
})*/

app.get('/CHW', (req, res) => {
  db.query('SELECT reported, hh_id, diag_cough, diag_fever, chw_id, visit_id, hh_lat as lat, hh_lon as lon FROM mock_data', (err, result) => {
    if (err) {
      throw(err)
    }else {
      var chws = {}
      for (var i = 0; i < result.rows.length; i++) {
        if (chws[result.rows[i].chw_id]) {
          chws[result.rows[i].chw_id].push(result.rows[i])
        }else {
          chws[result.rows[i].chw_id] = [result.rows[i]]
        }
      }
      res.json(chws)
    }
  })
})

app.get('/fine_pop/:z/:x/:y.geojson', (req, res) => {
  var tile = getBBox(req.params.x, req.params.y, req.params.z)

  console.log(req.params.z)
  if (req.params.z < 13) {
    res.json([])
    return
  }

  var q = `
    SELECT ST_X(geom) as lon, ST_Y(geom) as lat, pop FROM pop_density WHERE
      ST_Contains(${tile.bbox_4326}, geom) AND country='Guatemala'
  `
  console.log(q)
  db.query(q, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }else {
      res.json(result.rows)
    }
  })
})

app.get('/pop_layer/:z/:x/:y.geojson', (req, res) => {
  var tile = getBBox(req.params.x, req.params.y, req.params.z)

  var q = `SELECT 'Feature' as type, 
              ST_AsGeoJSON(shapes.geom)::json as geometry,
              json_build_object(  
                  'name0', shapes.name0,
                  'name1', shapes.name1,
                  'name2', shapes.name2,
                  'gid', gid
              ) as properties FROM shapes 
                WHERE ST_Intersects(geom, ${tile.bbox_4326}) AND
                      shapes.level=2;`
  console.log(q)
  db.query(q, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }else {
      res.json(result.rows)
    }
  })
})

app.get('/GetZikaDates', function (req, res) {
  db.query('SELECT DISTINCT report_date FROM zika ORDER BY report_date;').then((data) => {
    res.json(data.rows.map((x) => new Date(x.report_date).toDateString()))
  }).catch((err) => {
    console.log(err)
  })
})

app.get('/Email', function (req, res) {
  var address = req.query.address
  var text = req.query.text
  console.log(`echo "${text}" | mutt -s "Message from ATLAS" ${address}`)
  exec(`echo "${text}" | mutt -s "Message from ATLAS" ${address}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })
})

app.get('/Text', function (req, res) {
  var number = req.query.number
  var text = req.query.text
  console.log(`Sending ${number}: ${text}`)
  textbelt.sendText(number, text, function (err) {
    if (err) {
      console.log(err)
    }
  })
})

app.listen(port, ip, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening at http://${ip}:${port}`)
})
