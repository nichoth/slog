var NodeView = require('./NodeView.js');

module.exports = NewNode;

function NewNode() {
  return NodeView({
    requiredFields: [{
      field: 'name'
    }]
  });
}

NewNode.render = NodeView.render;
