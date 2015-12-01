var struct = require('observ-struct');
var observ = require('observ');
var oArray = require('observ-array');
var h = require('virtual-dom/h');
var Form = require('vdom-kv-form');
var FormField = require('vdom-form/lib/FormField');

module.exports = NewNode;

function NewNode(opts) {
  opts = opts || {};
  opts.onSubmit = opts.onSubmit || function(){};

  var fields = [
    FormField({
      field: 'name'
    })
  ];

  var state = struct({
    fields: oArray(fields),
    kvForm: Form({
      rows: [{ field: '', value: '' }]
    }),
    handles: {
      onSubmit: opts.onSubmit
    }
  });

  return state;

}


NewNode.render = function(h, state) {
  return h('form.new-node-view', {
    onsubmit: function (ev) {
      ev.preventDefault();
      state.handles.onSubmit(Form.values(state.kvForm));
    }
  }, [
    FormField.render(h, state.fields[0]),
    Form.render(h, state.kvForm),
    require('vdom-kv-form/lib/submit-button')(h)
  ]);
};
