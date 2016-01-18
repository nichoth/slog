var List = require('vdom-list');
var state = require('@nichoth/state');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var extend = require('xtend');

module.exports = NodeListView;

function NodeListView(opts) {
  opts = opts || {};
  var nodesObservable = opts.nodesObservable || oArray([]);

  var s = state({
    nodeMatches: List({
      items: nodesObservable()
    })
  });

  nodesObservable(function onChange(nodes) {
    var nodeEls = nodes.map(function(n) {
      return {
        el: h('a', {href: '/node/'+n.index}, [n.name])
      };
    });
    s.nodeMatches.set( List({ items: nodeEls })() );
  });

  return s;
}


NodeListView.render = function(state) {
  return h('div', [
    h('h3', 'Nodes'),
    List.render(h, state.nodeMatches)
  ]);
};
