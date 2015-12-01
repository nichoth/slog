var vdom = require('virtual-dom');
var App = require('../lib/App.js');
var observ = require('observ');

var state = App();

var loop = require('main-loop')( state(), App.render, vdom );
state(loop.update);
document.getElementById('content').appendChild(loop.target);
