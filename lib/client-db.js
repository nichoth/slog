var shoe = require('shoe');
var db = require('multilevel').client( require('../data/manifest.json') );
var sock = shoe('/sock');
sock.pipe( db.createRpcStream() ).pipe(sock);

db.liveStream().on('data', console.log.bind(console));
window.db = db;
window.graph = require('levelgraph')(db.sublevels.graph);
// window.graph = graph;
window.clearDb = function() {
  clearSub(db);
  clearSub(db.sublevels.graph);
  function clearSub(db) {
    db.createReadStream().on('data', function(item) {
      db.del(item.key);
    });
  }
};
// window.getTriples = function() {
//   graph.get({}, console.log.bind(console));
// };
window.readDb = function(ldb) {
  (ldb || db).createReadStream().on('data', console.log.bind(console));
};

module.exports = db;
