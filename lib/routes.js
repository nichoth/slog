var NewNode = require('./NewNodeView.js');
var ListView = require('./ListView.js');
var h = require('virtual-dom/h');
// var db = require('./client-db');

function Link(url, words) {
  return h('a', {href: url}, [words]);
}

module.exports = function() {

  var items = [
    {
      name: 'location',
      children: [
        Link('/', 'seattle'),
        Link('/', 'olympia'),
        Link('/', 'tangier')
      ]
    }
  ];

  var routes = {
    '/': {
      component: {
        state: ListView({
          items: items
        }),
        render: ListView.render.bind(null, h)
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
