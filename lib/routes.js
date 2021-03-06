var NewNode = require('./NewNodeView.js');
var RootView = require('./RootView.js');
var EditNode = require('./EditNode.js');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var struct = require('observ-struct');
var adapter = require('./adapter.js')( require('./client-db.js') );

module.exports = function() {

  var fields = oArray([]);
  fields(function onChange(fs) {
    console.log('change', fs);
  });
  db.liveStream({
    min: 'field',
    max: 'field~'
  }).on('data', function(event) {

    // del
    if (event.type === 'del') {
      console.log('del field', event);
      var vs = fields().filter(function(f) {
        if (f.index === event.key) console.log(f);
        return f.index !== event.key;
      });
      fields.set(vs);
      console.log(vs);
      return;
    }

    // put
    console.log('put', event);
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
          fetchNodesFn: adapter.fetchNodes
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
            console.log('save an existing node');
          },
          onDelete: function(index) {
            adapter.delNode({key: index}, function(err, node) {
              if (err) return console.log('err', err);
              console.log('deleted', node);
            });
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
