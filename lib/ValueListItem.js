var state = require('@nichoth/state');
var h = require('virtual-dom/h');
var oArray = require('observ-array');
var extend = require('xtend');
var CrudItem = require('vdom-crud-li');
var observ = require('observ');

module.exports = ValueListItem;

function ValueListItem(opts) {
  opts = opts || {};
  opts.value = opts.value || {};

  var s = state({
    valueName: observ(opts.value.name || '')
  });

  function Link(url, words, query) {
    return h('a', {
      href: url,
      onclick: function(ev) {
        ev.preventDefault();
        opts.fetchNodesFn(query, function(err, nodes) {
          console.log(nodes);
          // nodesObservable.set(nodes);
        });
      }
    }, [words]);
  }

  return s;
}

ValueListItem.render = function(state) {
  return h('div', state.valueName);
};
