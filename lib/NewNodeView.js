var NodeView = require('./NodeView.js');
var extend = require('xtend');

module.exports = NewNode;

function NewNode(opts) {
  return NodeView(extend(opts, {
    requiredFields: [{
      field: 'name'
    }]
  }));
}

NewNode.render = NodeView.render;
