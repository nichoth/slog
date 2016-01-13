var List = require('vdom-list');
var state = require('@nichoth/state');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var extend = require('xtend');
var NodeListView = require('./NodeListView');
var FieldListView = require('./FieldListView');

module.exports = RootView;


function RootView(opts) {

  opts = opts || {};
  opts.observableFields = opts.observableFields || function(){};
  opts.fetchNodesFn = opts.fetchNodesFn || function(){};
  var nodesObservable = oArray([]);

  var s = state({
    fieldList: FieldListView({
      fields: opts.observableFields(),
      fetchNodesFn: function(query, cb) {
        opts.fetchNodesFn(query, function(err, nodes) {
          if (err) return cb(err);
          nodesObservable.set(nodes);
          cb(null, nodes);
        });
      }
    }),
    nodeList: NodeListView({ nodesObservable: nodesObservable })
  });


  opts.observableFields(function onChange(fields) {
    FieldListView.set(s.fieldList, fields)
  });

  return s;
}


RootView.render = function(h, state) {
  function Column(child) {
    return h('div.column', {
      style: {
        float: 'left',
        width: '33%',
      }
    }, child);
  }
  return h('div.root-route', [
    Column([
      FieldListView.render(state.fieldList)
    ]),
    Column([
      NodeListView.render(state.nodeList)
    ]),
    h('a', {href: '/new'}, ['create a new thing'])
  ]);
};

