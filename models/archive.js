/**
 * Archive
 * @author wyicwx
 * @fileOverview  归档对象构造函数
 */

var	DB = require("./db.js"),
	util = require("./util.js");
/**
 * @constructor Archive
 * @description 归档对象构造函数
 */
function Archive(obj) {
	this.structor = {
		archive : "",
		bids : [],
		length : 0,
		date : null
	}
	if(obj) this.set(obj);
	if(obj.date) this.formatDate();
}

Archive.dbTool = new DB("blog.archive");

Archive.prototype = {
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

	getArchive: function() {
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
	},

	formatDate: function() {
		var date = this.getArchive().date;

			date = date.getFullYear() + "年" + date.getMonth() + 1 + "月";
			this.getArchive().archive = date;

		return date;

	}

}

module.exports = Archive;