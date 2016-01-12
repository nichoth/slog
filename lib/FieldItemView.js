var List = require('vdom-list');
var state = require('@nichoth/state');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var extend = require('xtend');
var observ = require('observ');
var ValueItem = require('./ValueListItem');

module.exports = FieldItem;

function FieldItem(opts) {
  opts = opts || {};
  opts.field = opts.field || {};
  opts.field.values = opts.field.values || [];
  opts.fetchNodesFn = opts.fetchNodesFN || function(){};

  var s = state({
    fieldName: observ(opts.field.name || ''),
    values: oArray(opts.field.values.map(function(v) {
      return ValueItem({
        value: v
      });
    })),
  });

  return s;
}

FieldItem.render = function(state) {
  return h('div', [
    state.fieldName,
    h('ul', [
      state.values.map(function(v) {
        return h('li', [
          ValueItem.render(v)
        ]);
      })
    ])
  ]);
};
