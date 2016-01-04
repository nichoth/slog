var http = require('http');
var ecstatic = require('ecstatic')({root: __dirname + '/public'});
var rpc = require('rpc-stream');
var routes = ['/', '/new', '/node/:id'];
var router = require('routes')();
var fs = require('fs');
var shoe = require('shoe');
var multilevel = require('multilevel');
var liveStream = require('level-live-stream');
// var slogdb = require('slog-db-level');

// var db = require('level')(__dirname+'/data/db', {
//   valueEncoding: 'json'
// });
// var sdb = slogdb(db);
//
// var rpcServer = rpc(sdb);

var db = require('level-sublevel')(require('level')(__dirname+'/data/db', {
  valueEncoding: 'json'
}));
db.sublevel('graph', { valueEncoding: 'utf8' });
liveStream.install(db);

// trying level plugin via level-manifest
// db.methods = db.methods || {};
// db.methods.foo = { type: 'async' };
// db.foo = function(cb) {
//   cb(null, 'bar');
// }

multilevel.writeManifest(db, __dirname+'/data/manifest.json');

routes.forEach(function(r) {
  router.addRoute(r, appRoute);
});

function appRoute(req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.createReadStream('public/index.html')
    .pipe(res);
}

var server = http.createServer(function(req, res) {
  var m = router.match(req.url);
  if (m) {
    m.fn(req, res, m.params);
  }
  else {
    ecstatic(req, res);
  }
}).listen(8000);
console.log('Listening on :8000');

// websockets
var sock = shoe(function(stream) {
  stream.pipe( multilevel.server(db) ).pipe(stream);
});
sock.install(server, '/sock');

// wss = websocket.createServer({server: server}, function(stream) {
//   stream.pipe( multilevel.server(db) ).pipe(stream);
// });
