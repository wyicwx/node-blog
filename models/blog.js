var	DB = require("./db.js"),
	util = require("./util.js");

function Blog() {

	this.structor = {
		title 	: "",
		author 	: "",
		tags 	: [],
		date 	: new Date(),
		editdate: new Date(),
		content : "",
		md 		: "",
		bid 	: -1,
		comments : [],
		// isDelete : false,
		// isTop : false,
		// setTopDate : new Date(),
		// hasImage : false,
		// imageUrl : "/",
		// isTopic: false,
		// topic : "",
		ip : "not ip address"
	}
}

Blog.dbTool = new DB("blog");

Blog.prototype = {
	
	set: function(key,value,force) {
		if(util.isString(key)) {
			if(force||key in this.structor) {
				this.structor[key] = value;
				return true;
			}
			return false;
		} else {
			for(var i in key) {
				if(i in this.structor) {
					this.structor[i] = key[i];
				}
			}
			return true;
		}
	},

	get: function(key) {
		if(key in this.structor) {
			return this.structor[key];
		}
		return false;
	},

	getBlog: function() {
		return this.structor;
	},

	pack: function(obj) {
		var blog = this.structor;

		for(var i in obj) {
			blog[i] = obj[i];
		}
		return this;
	},

	toString: function() {
		return JSON.stringify(this.structor);
	}

}

module.exports = Blog;