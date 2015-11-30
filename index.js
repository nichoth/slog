var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var Form = require('vdom-kv-form');
// var Form = require('vdom-components/Form');

module.exports = App;

function App(opts) {
  opts = opts || {};

  var state = struct({
    form: Form({ rows: [{ field: '', value: '' }] })
  });

  return state;

}


App.render = function(state) {
  return h('div.app', [
    Form.render(h, state.form)
  ]);
};
