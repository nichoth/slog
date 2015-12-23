var List = require('vdom-list');
var state = require('@nichoth/state');

module.exports = ListView;


function ListView(opts) {

  opts = opts || {};
  opts.changeEvent = opts.changeEvent || function(){};

  var s = state({
    list: List({
      items: opts.changeEvent()
    })
  });

  opts.changeEvent(function onChange(data) {
    s.list.set( List({
      items: data
    }) );
  });

  return s;
}


ListView.render = function(h, state) {
  return h('div.root-route', [
    List.render(h, state.list),
    h('a', {href: '/new'}, ['create a new thing'])
  ]);
};
