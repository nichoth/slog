var List = require('vdom-list');
var state = require('@nichoth/state');
var h = require('virtual-dom/h');
var oArray = require('observ-array');

module.exports = ListView;


function ListView(opts) {

  opts = opts || {};
  opts.changeEvent = opts.changeEvent || function(){};
  opts.fetchFn = opts.fetchFn;
  var nodesObservable = oArray([]);

  var s = state({
    list: List({
      items: opts.changeEvent() || []
    }),
    nodeMatches: List({
      items: nodesObservable()
    })
  });

  nodesObservable(function onChange(nodes) {
    console.log('change', nodes);
    var nodeEls = nodes.map(function(n) {
      return {
        el: h('a', {href: '/node/'+n.index}, [n.name])
      };
    });
    s.nodeMatches.set( List({ items: nodeEls })() );
  });

  function Link(url, words, query) {
    return h('a', {
      href: url,
      onclick: function(ev) {
        ev.preventDefault();
        opts.fetchFn(query, function(err, nodes) {
          console.log(nodes);
          nodesObservable.set(nodes);
        });
      }
    }, [words]);
  }

  opts.changeEvent(function onChange(data) {
    s.list.set( List({
      items: data.map(function(d) {
        d.children = d.children.map(function(val) {
          return Link('/', val.name, {
            predicate: data.index,
            object: val.index
          });
        });
        return d;
      })
    })() );
  });

  return s;
}


ListView.render = function(h, state) {
  function Column(child) {
    return h('div.column', {
      style: {
        float: 'left',
        width: '33%',
      }
    }, child);
  }
  return h('div.root-route', [
    Column([
      h('h3', 'Fields'),
      List.render(h, state.list)
    ]),
    Column([
      h('h3', 'Nodes'),
      List.render(h, state.nodeMatches)
    ]),
    h('a', {href: '/new'}, ['create a new thing'])
  ]);
};
