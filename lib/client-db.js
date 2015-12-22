var shoe = require('shoe');
var levelgraph = require('levelgraph');
var db = require('multilevel').client( require('../data/manifest.json') );
var graph = levelgraph(db.sublevels.graph);
var sock = shoe('/sock');
sock.pipe( db.createRpcStream() ).pipe(sock);
// var websocket = require('websocket-stream');
// var ws = websocket('ws://localhost:8000');
// ws.pipe( db.createRpcStream() ).pipe(ws);

// db.liveStream().on('data', console.log.bind(console));
window.db = db;
window.graph = graph;

module.exports = {
  db: db,
  graph: graph
};
