var NewNode = require('./NewNodeView.js');
var h = require('virtual-dom/h');
var db = require('./client-db');

module.exports = function() {

  var routes = {
    '/': {
      component: {
        state: '',
        render: function() {
          return h('div', [
            'root route',
            h('br'),
            h('a', {href: '/new'}, ['create a new thing'])
          ]);
        }
      }
    },
    '/new': {
      component: {
        state: NewNode({
          onSubmit: console.log.bind(console)
        }),
        render: NewNode.render.bind(null, h)
      }
    }
  };

  return routes;

};
