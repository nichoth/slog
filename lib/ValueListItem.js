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
  opts.queryFn = opts.queryFn || function(){};

  var s = state({
    crudder: CrudItem({
      value: opts.value.name || '',
      textNodeFn: function(val) {
        return Link('/', val, opts.queryFn);
      },
      deleteFn: console.log.bind(console, 'delete', opts.value.name)
    })
  });

  function Link(url, words, queryFn) {
    return h('a', {
      href: url,
      onclick: function(ev) {
        ev.preventDefault();
        queryFn(function(err, nodes) {
          console.log(nodes);
        });
      }
    }, [words]);
  }

  return s;
}

ValueListItem.render = function(state) {
  return h('div', {
    style: {
      paddingRight: '5em'
    }
  }, CrudItem.render(h, state.crudder));
};
