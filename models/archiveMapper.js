/**
 * ArchiveMapper
 * @author wyicwx
 * @fileOverview  archive集合相关操作
 */
var Archive = require("./archive.js"),
	fnTool = require("./function.js");
/**
 * @constructor ArchiveMapper
 * @description archive集合相关操作
 */
function ArchiveMapper() {
	this.isError = false;
	this.error = null;
}

ArchiveMapper.prototype = {
	/**
	 * 异步归档	
	 * @param  {Number}   bid  归档blog的bid
	 * @param  {Function} fn   回调函数
	 */
	saveAsync : function(bid, fn) {
		var archive = new Archive({date:new Date()}),
			_this = this;

		Archive.dbTool.db_upsert({
			"archive": archive.get("archive")
		},{
			"$push": {"bids": bid},
			"$inc": {"length": 1},
			"$set": {"date":archive.get("date")}
		},function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
			}

			return fn&&fn(data);
		});
	},
	/**
	 * 异步查找方法
	 * @param  {Object}   conditions 存储查找条件（obj,opt,ot参照find函数）
	 * @param  {Function} fn          回调函数
	 * @return {Undefined}           
	 */
	findAsync: function(conditions, fn) {
		
		var _this = this;

		Archive.dbTool.db_find(conditions.obj, conditions.opt, conditions.ot, function(err, data) {
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

		Archive.dbTool.db_findOne(conditions, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}
			
			fn(data);			
		});
	}


}

module.exports = ArchiveMapper;