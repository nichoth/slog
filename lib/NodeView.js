var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var Form = require('vdom-kv-form');
var FormForm = require('vdom-form');
var curry = require('vdom-form/lib/curry-component');
var FormField = require('vdom-form/lib/FormField');

module.exports = NodeView;


function NodeView(opts) {
  opts = opts || {};
  opts.onSubmit = opts.onSubmit || function(){};
  opts.requiredFields = opts.requiredFields || [];
  opts.fields = opts.fields || [];

  var fields = opts.requiredFields.map(function(f) {
    return curry(FormField, {
      field: f.field,
      value: f.value || '',
      isValid: f.isValid || function(value) {
        return value && value.length;
      }
    })
  });

  var kvData = opts.fields.length ? opts.fields : [{ field: '', value: '' }];

  var state = struct({
    form: FormForm({
      fields: fields
    }),
    kvForm: Form({
      rows: kvData
    }),
    handles: {
      onSubmit: opts.onSubmit
    }
  });

  return state;

}


NodeView.render = function(h, state) {
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

