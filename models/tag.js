/**
 * Tag
 * @author wyicwx
 * @fileOverview  标签对象构造函数
 */

var	DB = require("./db.js");
/**
 * @constructor Tag
 * @description 标签对象构造函数
 */
function Tag() {

	this.structor = {
		tag : "",
		size : 1
	}

}

Tag.dbTool = new DB("blog.tags");

Tag.prototype = {
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

	getAdmin: function() {
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

module.exports = Tag;