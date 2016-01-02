var state = require('@nichoth/state');
var NodeView = require('./NodeView.js');

module.exports = EditNode;

function EditNode(opts) {
  opts = opts || {};
  opts.observableNode = opts.observableNode || function(){};

  var s = state({
    nodeView: getNodeViewState(opts.observableNode() || {})
  });

  function getNodeViewState(node) {

    var state = NodeView({
      requiredFields: [
        { field: 'name', value: node.name }
      ],
      fields: Object.keys(node).reduce(function(acc, f) {
        if (f === 'name' || f === 'index') return acc;
        acc.push({ field: f, value: node[f] });
        return acc;
      }, [])
    });

    return state;
  }

  var stopListening = function(){};
  opts.observableNode(function onChange(node) {
    var nodeViewEmitter = getNodeViewState(node);
    stopListening();
    s.nodeView.set(nodeViewEmitter());
    stopListening = nodeViewEmitter(function onChange(viewState) {
      s.nodeView.set(viewState);
    });
  });

  return s;
}

EditNode.render = function(h, state) {
  return NodeView.render(h, state.nodeView);
};
