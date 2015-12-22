var NewNode = require('./NewNodeView.js');
var ListView = require('./ListView.js');
var h = require('virtual-dom/h');
var dbs = require('./client-db');
var db = dbs.db;
var graph = dbs.graph;
var oArray = require('observ-array');

function Link(url, words) {
  return h('a', {href: url}, [words]);
}

module.exports = function() {

  var things = oArray([]);
  db.liveStream().on('data', function(event) {

    // del
    if (event.type === 'del') {
      var vs = things().filter(function(t) {
        return t.index !== event.key;
      });
      things.set(vs);
      return;
    }

    // put
    var data = event.value;
    data.index = event.key;
    things.unshift( data );

  });

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
          items: items,
          changeEvent: things
        }),
        render: ListView.render.bind(null, h)
      }
    },
    '/new': {
      component: {
        state: NewNode({
          onSubmit: submit
        }),
        render: NewNode.render.bind(null, h)
      }
    }
  };

  function submit(fs) {


    db.batch([{
      type: 'put',
      key: 'test',
      value: 'testv',
      prefix: db.sublevels.graph
    }, {
      type: 'put',
      key: 'test2',
      value: 'testv2',
      prefix: 'graph'
    }], console.log.bind(console));


  }

  return routes;

};
