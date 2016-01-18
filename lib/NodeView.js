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
  opts.onDelete = opts.onDelete || function(){};
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
      onSubmit: opts.onSubmit,
      onDelete: opts.onDelete
    }
  });

  return state;

}


NodeView.render = function(h, state) {

  var delButton = h('button.vdom-kv-form-button', {
    onclick: function(ev) {
      ev.preventDefault();
      console.log('delete');
    }
  }, ['Delete']);

  function button(text, attrs) {
    return h('button.vdom-kv-form-button', attrs, [text]);
  }

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
    h('div.vdom-kv-form-button-row', [
      button('Delete', {
        onclick: function(ev) {
          ev.preventDefault();
          state.handles.onDelete();
        }
      }),
      button('Save', {
        disabled: !FormForm.isValid(state.form)
      })
    ])
  ]);
};

