'use strict';
var DataStore = require('nedb'), path = require('path');
var db = {
	mappings: new DataStore({mappings: path.join(__dirname, 'mappings.db'), autoload: true})
};
db.mappings.insert({alias: 'g', url: 'http://www.google.com'}, function(err, insertedDocument){
	//.....
});
var mappings = {
	get: function(alias, callback) {
		db.mappings.findOne({ alias: alias }, function(err, mapping) {
			if(err || !mapping)
				return callback(new Error("Alias not found"));
			callback(null, mapping.url);
		});
	},

	create: function(alias, url, callback) {
		db.mappings.insert({ alias: alias, url: url }, callback);
	},
	
	list: function(callback) {
		db.mappings.find({}).sort({ alias: 1}).exec(callback);
	}
};
module.exports = mappings;