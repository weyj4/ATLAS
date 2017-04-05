require('dotenv').config({path : __dirname + '/.env'})
var bodyParser = require('body-parser')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')
var path = require('path')

var port = process.env.PORT || 8080

var app = express()
var compiler = webpack(config)

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))

// If this is in development mode, then enable hot reloading
if (process.env.NODE_ENV === 'dev') {
  console.log('dev')
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: config.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
  
  app.listen(port, function () {
    console.log('Listening at http://localhost:' + port)
  })
}else{
  app.listen(port, function () {
    console.log('Listening at http://localhost:' + port)
  })  
}

var routes = require('./backend/routes')()
app.use('/', routes)

app.use(express.static(path.join(__dirname, '/public/')))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app