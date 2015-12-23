var NewNode = require('./NewNodeView.js');
var ListView = require('./ListView.js');
var h = require('virtual-dom/h');
var dbs = require('./client-db');
var db = dbs.db;
var graph = dbs.graph;
var oArray = require('observ-array');

function Link(url, words) {
  return h('a', {href: url}, [words]);
}

module.exports = function() {

  var things = oArray([]);
  db.liveStream().on('data', function(event) {

    // del
    if (event.type === 'del') {
      var vs = things().filter(function(t) {
        return t.index !== event.key;
      });
      things.set(vs);
      return;
    }

    // put
    var data = event.value;
    data.index = event.key;
    things.unshift( data );

  });

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

  var routes = {
    '/': {
      component: {
        state: ListView({
          changeEvent: things
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
      return op;
    }));

    db.batch(ops, console.log.bind(console));
  }

  return routes;

};
