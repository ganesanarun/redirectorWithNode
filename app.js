'use strict';

var http = require('http'),
		path = require('path');

var express = require('express'),
		socket = require('socket.io');

var logger = require('./logging'),
	  mappings = require('./data/mappings');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger.setup('redirector'));
app.use(express.static(path.join(__dirname, 'public')));

// Version 1

// app.get('/', function(req, res) {
// 	mappings.list(function(err, documents){
// 		res.render('index', {
// 			mappings: documents
// 		});
// 	});
// });

// Single page app
app.get('/', function(req, res) {
	res.render('index');
});

app.get('/:alias', function(req, res) {
	mappings.get(req.params.alias, function(error , mapping) {
		if(error) { return res.sendStatus(404); }
	  res.redirect(mapping);
	});
});

var server =http.createServer(app);
server.listen(3000, function() { console.log('app is up and running'); });
var io = socket.listen(server);
io.sockets.on('connection', function(socket){
	mappings.list(function(err, documents){
		socket.emit('list', documents);
	});
	socket.on('addMapping', function(mapping) {
		mappings.create(mapping.alias, mapping.url, function() {
			console.log('Yay, created a new mapping', mapping);
			socket.emit('newMapping', mapping);
			// io.sockets.emit('newMapping', mapping);
		});
	});
});