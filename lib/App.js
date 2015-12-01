var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var NewNode = require('./NewNodeView.js');

module.exports = App;

function App(opts) {
  opts = opts || {};
  opts.onSubmit = opts.onSubmit || function(){};

  var state = struct({
    newNode: NewNode({
      onSubmit: console.log.bind(console)
    })
  });

  return state;

}


App.render = function(state) {
  return h('div.app', [
    NewNode.render(h, state.newNode)
  ]);
};
