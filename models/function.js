var Blog = require("./blog.js"),
	Comment = require("./comment.js"),
	config = require("../config.js");

exports.getBid = (function() {
	var current;

	Blog.dbTool.db_count(function(err, data) {
		if(err) throw err;
		current = parseInt(data,10) != NaN ? parseInt(data,10) : 0;
	})

	return function() {
		return ++current;
	}
})();

exports.getCid = (function() {
	var current;

	Comment.dbTool.db_count(function(err, data) {
		if(err) throw err;
		current = parseInt(data,10) != NaN ? parseInt(data,10) : 0;
	})

	return function() {
		++current;
	}
})(); 

exports.getGlobalParam = function(req) {
	var obj = {
		siteName : config.siteName,
		admin : req.session.admin
	}
	return obj;
}

