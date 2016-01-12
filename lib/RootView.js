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
  opts.fetchFn = opts.fetchFn;
  var nodesObservable = oArray([]);

  var s = state({
    fieldList: FieldListView({ fields: opts.observableFields() }),
    nodeList: NodeListView({ nodesObservable: nodesObservable })
  });

  var stopListening;
  opts.observableFields(function onChange(fields) {

    if (stopListening) stopListening();

    var fs = fields.map(function(f) {
      return f;
    });

    var fieldListState = FieldListView({ fields: fs });
    stopListening = fieldListState(function onChange(state) {
      s.fieldList.set(state);
    });
    s.fieldList.set( fieldListState() );

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

