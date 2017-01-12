require('dotenv').config({silent: true})
var express = require('express')
var path = require('path')
var pg = require('pg')
var SphericalMercator = require('sphericalmercator')
var _ = require('lodash')
var webpack = require('webpack')
var webpackConfig = require('../webpack.config')
var compiler = webpack(webpackConfig)
var tilelive = require('tilelive')
require('tilelive-mapnik').registerProtocols(tilelive)

var config = _.extend({database: 'atlas'}, process.env.DB_USER ? {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
} : {})

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

var db = new pg.Client(config)
db.connect()

var app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
}

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

tilelive.load(`mapnik://${__dirname}/Heatmap.xml`, (err, source) => {
  if(err){
    throw(err);
  }else{
    app.get('/pop_mb/:z/:x/:y.png', (req, res) => {
      source.getTile(req.params.z, req.params.x, req.params.y, (err, tile, headers) => {
        if(err){
          res.status(500).send(err)
        }else{
          res.send(tile)
        }
      })
    })
  }
})

app.get('/CHW', (req, res) => {
  db.query('SELECT lat, lon, label1, label2 FROM tula.markers', (err, result) => {
    if (err) {
      res.status(500).send(err)
    }else {
      res.json(result.rows)
    }
  })
})

app.listen(port, ip, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening at http://${ip}:${port}`)
})
