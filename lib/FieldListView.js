var List = require('vdom-list');
var observ = require('observ');
var state = require('@nichoth/state');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var extend = require('xtend');
var FieldItem = require('./FieldItemView');

module.exports = FieldListView;

function FieldListView(opts) {

  opts = opts || {};
  opts.fetchFn = opts.fetchFn;
  opts.fields = opts.fields || [];

  var s = state({
    fields: oArray( opts.fields.map(function(f) {
      return FieldItem({ field: f });
    }))
  });

  return s;
}


FieldListView.render = function(state) {
  return h('div', [
    h('h3', 'Fields'),
    state.fields.map(function(f) {
      return FieldItem.render(f);
    })
  ]);
};
