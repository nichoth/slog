var struct = require('observ-struct');
var observ = require('observ');
var h = require('virtual-dom/h');
var routes = require('./routes')();
var Router = require('wrouter');

module.exports = App;

function App(opts) {
  opts = opts || {};

  var state = struct({
    router: Router({
      routeHash: routes
    })
  });

  return state;
}


App.render = function(state) {
  var page = Router.route(state.router);
  return h('div.app', [
    page ? page.render(page.state) : ''
  ]);
};
