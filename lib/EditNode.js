var state = require('@nichoth/state');

module.exports = EditNode;


function EditNode(opts) {
  opts = opts || {};
  opts.observableNode = opts.observableNode || function(){};

  var s = state({
    node: opts.observableNode
  });

  return s;
}

EditNode.render = function(h, state) {
  console.log(state);
  return h('pre', [JSON.stringify(state.node)]);
};
