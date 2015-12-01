var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var Form = require('vdom-kv-form');

module.exports = App;

function App(opts) {
  opts = opts || {};
  opts.onSubmit = opts.onSubmit || function(){};

  var state = struct({
    form: Form({
      rows: [{ field: '', value: '' }],
      onSubmit: opts.onSubmit
    })
  });

  return state;

}


App.render = function(state) {
  return h('div.app', [
    Form.render(h, state.form)
  ]);
};
