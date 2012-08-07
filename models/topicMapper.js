/**
 * TopicMapper
 * @author wyicwx
 * @fileOverview  topic集合相关操作
 */
var Topic = require("./topic.js"),
	fnTool = require("./function.js");
/**
 * @constructor TopicMapper
 * @description topic集合相关操作
 */
function TopicMapper() {
	this.isError = false;
	this.error = null;
}

TopicMapper.prototype = {
	/**
	 * 异步归档	
	 * @param  {Number}   bid  归档blog的bid
	 * @param  {Function} fn   回调函数
	 */
	saveAsync : function(topic, bid, fn) {
		var topic = new Topic({topic: topic}),
			_this = this;

		Topic.dbTool.db_upsert({
			"topic": topic
		},{
			"$push": {"bids": bid},
			"$inc": {"length": 1},
			"$set": {"date":new Date()}
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

		Topic.dbTool.db_find(conditions.obj, conditions.opt, conditions.ot, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}
			
			fn(data);			
		});
	}

}

module.exports = TopicMapper;