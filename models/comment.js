/**
 * Comment
 * @author wyicwx
 * @fileOverview  评论对象构造函数
 */
 var	DB = require("./db.js"),
	util = require("./util.js");
/**
 * @constructor Comment
 * @description 评论对象构造函数
 */
function Comment() {

	this.structor = {
		author : "",
		comment  : "",
		email 	 : "",
		avatar 	 : "",
		commentto: "",
		url  : "",
		ip 		 : "not ip address",
		bid 		 : 0,
		cid  	 : 0,
		//	isDelete : false
		date: new Date()
	}
}

Comment.dbTool = new DB("blog.comments"); 

Comment.prototype = {
	/**
	 * 设置属性方法
	 * @param {String||Object} key   key
	 * @param {String} value value
	 * @return {Boolean} 返回是否设置成功
	 * 				@example
	 * 				comment.set("key","value");
	 * 				comment.set({"key":"value"});
	 */
	set: function(key,value) {
		if(util.isString(key)) {
			if(key in this.structor) {
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

	getComment: function() {
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

module.exports = Comment;