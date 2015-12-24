var NewNode = require('./NewNodeView.js');
var ListView = require('./ListView.js');
var h = require('virtual-dom/h');
var dbs = require('./client-db');
var db = dbs.db;
var graph = dbs.graph;
var oArray = require('observ-array');
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
      console.log(err, values);
      var data = event.value;
      data.index = event.key;
      data.children = values.map(function(v) {
        return Link('/', v.name);
      });
      fields.unshift( data );
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

/*
  var items = [
    {
      name: 'location',
      children: [
        Link('/', 'seattle'),
        Link('/', 'olympia'),
        Link('/', 'tangier')
      ]
    }
  ];
*/

  var routes = {
    '/': {
      component: {
        state: ListView({
          changeEvent: fields
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
    }
  };

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
      op.prefix = 'graph';
      op.valueEncoding = 'utf8';
      return op;
    }));

    db.batch(ops, console.log.bind(console));
  }

  return routes;

};
