var http = require('http');
var ecstatic = require('ecstatic')({root: __dirname + '/public'});
var routes = ['/', '/new'];
var router = require('routes')();
var fs = require('fs');
var shoe = require('shoe');
//var websocket = require('websocket-stream');

var multilevel = require('multilevel');
var liveStream = require('level-live-stream');
var db = require('level-sublevel')(require('level')(__dirname + '/data/db', {
  valueEncoding: 'json'
}));
db.sublevel('graph', {
  valueEncoding: 'json'
});
liveStream.install(db);
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
