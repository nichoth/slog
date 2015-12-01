var vdom = require('virtual-dom');
var Logger = require('../lib/App.js');
var observ = require('observ');

var state = Logger({
});

var loop = require('main-loop')( state(), Logger.render, vdom );
state(loop.update);
document.getElementById('content').appendChild(loop.target);
