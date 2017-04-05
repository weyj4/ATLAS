'use strict'

var express = require('express')
var pg = require('pg')

var router = express.Router()

var db = new pg.Client({
  database : 'atlas',
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  host : process.env.DB_HOST,
  port : process.env.DB_PORT
})
db.connect()

function recursiveNest(marker, result, markers){
  if(marker.neighbors == null)  
    debugger
  for(var i = 0; i < marker.neighbors.length; i++){
    var child = markers[marker.neighbors[i]]
    if(marker.id === child.id)
      continue
    result.push(child)
    child.children = []

    recursiveNest(child, child.children, markers)
  }
  // delete marker.neighbors
}

function nestMarkers(markers){
  var result = [];
  for(var i = 0; i < markers.length; i++){
    if(markers[i].type === 'cs'){
      result.push(markers[i])
      markers[i].children = []
      recursiveNest(markers[i], markers[i].children, markers)
    }
  }
  return result;
}


module.exports = function () {
  router.get('/Markers', function(req, res){
    db.query(`
      SELECT 
        tula.markers.id - 1 as id,
        ST_AsGeoJSON(geom)::json as geom,
        description,
        type,
        CASE WHEN type='cs' THEN true ELSE false END AS active,
        COALESCE(json_agg(source_id-1) FILTER (WHERE source_id IS NOT NULL), '[]') AS neighbors
      FROM tula.markers
      LEFT JOIN tula.lines ON tula.markers.id=dest_id
      GROUP BY 
        tula.markers.id,
        geom,
        description,
        type
      ORDER BY tula.markers.id;
    `).then(function(result){
      res.json(result.rows)
    }).catch(function(err){
      res.status(500).send(err)
    })
  })

  return router
}





