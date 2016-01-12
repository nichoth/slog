var NewNode = require('./NewNodeView.js');
var RootView = require('./RootView.js');
var EditNode = require('./EditNode.js');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var struct = require('observ-struct');
var adapter = require('./adapter.js')( require('./client-db.js') );

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
    adapter.getValues(event.key, function(err, values) {
      var data = event.value;
      data.index = event.key;
      data.values = values;
      var i = fields().findIndex(function(f) {
        return f.index === event.key;
      });
      if (i >= 0) { fields.put(i, data); }
      else { fields.unshift( data ); }
    });

  });

  var observableNode = struct({});

  var routes = {
    '/': {
      component: {
        state: RootView({
          observableFields: fields,
          fetchFn: adapter.fetchNodes
        }),
        render: RootView.render.bind(null, h)
      }
    },
    '/new': {
      component: {
        state: NewNode({
          onSubmit: function(fields) {
            adapter.putNode(fields);
          }
        }),
        render: NewNode.render.bind(null, h)
      }
    },
    '/node/:id': {
      component: {
        state: EditNode({
          observableNode: observableNode,
          onSubmit: function() {
          }
        }),
        render: EditNode.render.bind(null, h)
      },
      routeFn: function(params, done) {
        adapter.fetchNode(params.id, function(err, node) {
          console.log(node);
          if (err) return console.log(err);
          observableNode.set(node);
          done();
        });
      }
    }
  };

  return routes;

};
