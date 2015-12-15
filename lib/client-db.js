var shoe = require('shoe');
var levelgraph = require('levelgraph');
var db = require('multilevel').client( require('../data/manifest.json') );
var graph = levelgraph(db.sublevels.graph);
var sock = shoe('/sock');
sock.pipe( db.createRpcStream() ).pipe(sock);

// db.liveStream().on('data', console.log.bind(console));
window.db = db;
window.graph = graph;

module.exports = db;
