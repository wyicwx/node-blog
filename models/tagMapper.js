/**
 * TagMapper
 * @author wyicwx
 * @fileOverview  tag集合相关操作
 */
var Tag = require("./tag.js"),
	fnTool = require("./function.js");

/**
 * @constructor TagMapper
 * @description tag集合相关操作
 */
function TagMapper() {
	this.isError = false;
	this.error = null;
}

TagMapper.prototype = {
	/**
	 * 异步保存标签
	 * @param  {String}   t  标签名
	 * @param  {Function} fn 回调函数
	 */
	saveAsync : function(t, fn) {
		var _this = this;

		Tag.dbTool.db_upsert({"tag":t}, {"$inc":{"size":1}}, function(err, data) {
			
			if(err) {
				_this.isError = true;
				_this.error = err;
			}

			return fn&&fn(data);

		})
	},
	/**
	 * 异步删除tag
	 * @param  {String}   t 要删除的tag
	 * @param  {Function} fn  回调函数
	 */
	deleteAsync: function(t, fn) {
		
	},
	/**
	 * 异步查找方法
	 * @param  {Object}   conditions 存储查找条件（obj,opt,ot参照find函数）
	 * @param  {Function} fn          回调函数
	 * @return {Undefined}           
	 */
	findAsync: function(conditions, fn) {
		
		var _this = this;

		Tag.dbTool.db_find(conditions.obj, conditions.opt, conditions.ot, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}
			
			fn(data);			
		});
	},

	findOneAsync: function(conditions, fn) {
		
		var _this = this;

		Tag.dbTool.db_findOne(conditions, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}
			
			fn(data);			
		});
	}


}

module.exports = TagMapper;