var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var Form = require('vdom-kv-form');
var FormForm = require('vdom-form');
var curry = require('vdom-form/lib/curry-component');
var FormField = require('vdom-form/lib/FormField');

module.exports = NewNode;


function NewNode(opts) {
  opts = opts || {};
  opts.onSubmit = opts.onSubmit || function(){};

  var fields = [
    curry(FormField, {
      field: 'name',
      isValid: function(value) {
        return value && value.length;
      }
    })
  ];

  var state = struct({
    form: FormForm({
      fields: fields
    }),
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
      var values = Form.values(state.kvForm);
      var reqVals = FormForm.values(state.form);
      reqVals = Object.keys(reqVals).map(function(k) {
        return { field: k, value: reqVals[k] };
      });
      state.handles.onSubmit( values.concat(reqVals) );
    }
  }, [
    FormForm.render(h, state.form),
    Form.render(h, state.kvForm),
    require('vdom-kv-form/lib/submit-button')(h, {
      disabled: !FormForm.isValid(state.form)
    })
  ]);
};
