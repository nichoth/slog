var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var Form = require('vdom-kv-form');
// var Form = require('vdom-components/Form');

module.exports = App;

function App(opts) {
  opts = opts || {};
  var event = opts.event || function(){};

  var state = struct({
    form: Form({rows: [{field: 'ham', value: 'test'}]})
  });

  event(function onChange(rows) {
    var formEmitter = Form({
      rows: rows
    });
    state.form.set(formEmitter());
    formEmitter(function onChange(data) {
      state.form.set(data);
    });
  });

  return state;

}


App.render = function(state) {
  return h('div.app', [
    Form.render(state.form)
  ]);
};
