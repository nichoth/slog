var NewNode = require('./NewNodeView.js');
var ListView = require('./ListView.js');
var EditNode = require('./EditNode.js');
var h = require('virtual-dom/h');
var dbs = require('./client-db');
var db = dbs.db;
var graph = dbs.graph;
var oArray = require('observ-array');
var struct = require('observ-struct');
var after = require('after');

function Link(url, words) {
  return h('a', {href: url}, [words]);
}

module.exports = function() {

  var fields = oArray([]);
  db.liveStream({
    min: 'field',
    max: 'field~'
  }).on('data', function(event) {

    // del
    if (event.type === 'del') {
      var vs = fields().filter(function(t) {
        return t.index !== event.key;
      });
      fields.set(vs);
      return;
    }

    // put
    getValues(event.key, function(err, values) {
      var data = event.value;
      data.index = event.key;
      data.children = values;
      var i = fields().findIndex(function(f) {
        return f.index === event.key;
      });
      if (i >= 0) { fields.put(i, data); }
      else { fields.unshift( data ); }
    });

  });

  function getValues(index, cb) {
    graph.get({ predicate: index }, function(err, res) {
      var valIndexes = res.reduce(function(acc, t) {
        acc[t.object] = true;
        return acc;
      }, {});


      var values = [];
      var next = after(Object.keys(valIndexes).length, function(err, res) {
        cb(err, values);
      });
      Object.keys(valIndexes).forEach(function(i) {
        db.get(i, function(err, res) {
          if (err) return next(err);
          res.index = i;
          values.push(res);
          next(null, values);
        });
      });
    });
  }

  var observableNode = struct({});

  var routes = {
    '/': {
      component: {
        state: ListView({
          changeEvent: fields,
          fetchFn: function(query, cb) {
            graph.get(query, function(err, res) {
              var nodes = [];
              var next = after(res.length, cb);
              res.forEach(function(r) {
                db.get(r.subject, function(err, node) {
                  nodes.push({ index: r.subject, name: node.name });
                  next(null, nodes);
                });
              });
            });
          }
        }),
        render: ListView.render.bind(null, h)
      }
    },
    '/new': {
      component: {
        state: NewNode({
          onSubmit: submit
        }),
        render: NewNode.render.bind(null, h)
      }
    },
    '/node/:id': {
      component: {
        state: EditNode({
          observableNode: observableNode,
          onSubmit: submitEdit
        }),
        render: EditNode.render.bind(null, h)
      },
      routeFn: function(params, done) {
        fetchNode(params.id, function(err, node) {
          console.log(node);
          if (err) return console.log(err);
          observableNode.set(node);
          done();
        });
      }
    }
  };

  function fetchNode(id, cb) {
    var node = { index: id };
    var next = after(2, function(err, node) {
      cb(err, node);
    });
    db.get(id, function(err, res) {
      if (err) return next(err);
      node.name = res.name;
      next(null, node);
    });
    graph.get({subject: id}, function(err, triples) {
      var n = after(triples.length, function(err, res) {
        next(err, node);
      });
      triples.forEach(function(t) {
        var fs = {};
        var nextInTriple = after(2, function(err, res) {
          node[res.field] = res.value;
          n(null, node);
        });
        db.get(t.predicate, function(err, res) {
          fs.field = res.name;
          nextInTriple(null, fs);
        });
        db.get(t.object, function(err, res) {
          fs.value = res.name;
          nextInTriple(null, fs);
        });
      });
    });
  }

  function submit(fields) {

    var node = fields.reduce(function(acc, f) {
      if (f.field) acc[f.field] = f.value;
      return acc;
    }, {});

    var fs = fields.filter(function(f) { return f.field !== 'name'; });

    console.log(node);

    var ops = [
      {
        type: 'put',
        key: 'node'+node.name,
        value: { name: node.name },
      }
    ];

    var triples = [];

    fs.forEach(function(f) {
      ops.push({
        type: 'put',
        key: 'field'+f.field,
        value: { name: f.field }
      });
      ops.push({
        type: 'put',
        key: 'value'+f.value,
        value: { name: f.value }
      });
      triples.push({
        subject: 'node'+node.name,
        predicate: 'field'+f.field,
        object: 'value'+f.value
      });
    });

    var triplesBatch = [];
    triples.forEach(function(t) {
      triplesBatch = triplesBatch.concat(graph.generateBatch(t));
    });

    ops = ops.concat(triplesBatch.map(function(op) {
      op.prefix = ['graph'];
      op.valueEncoding = 'utf8';
      return op;
    }));

    db.batch(ops, console.log.bind(console));
  }

  function submitEdit() {

  }

  return routes;

};
