var List = require('vdom-list');
var state = require('@nichoth/state');

module.exports = ListView;


function ListView(opts) {
  var s = state({
    list: List(opts)
  });
  return s;
}


ListView.render = function(h, state) {
  return h('div.root-route', [
    List.render(h, state.list),
    h('a', {href: '/new'}, ['create a new thing'])
  ]);
};
