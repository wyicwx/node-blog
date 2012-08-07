/**
 * CommentMapper
 * @author wyicwx
 * @fileOverview  comment集合相关操作
 */
var Comment = require("./comment.js"),
	fnTool = require("./function.js");

/**
 * @constructor CommentMapper
 * @description comment集合相关操作
 */
function CommentMapper() {
	this.isError = false;
	this.error = null;
};

CommentMapper.prototype = {
	/**
	 * 异步存储comment
	 * @param  {Object}   obj 存储comment属性对象
	 * @param  {Function} fn  回调函数
	 * @return {Object}       comment对象
	 */
	saveAsync: function(obj, fn) {
		
		var comment = new Comment(), _this = this;

		obj.cid = obj.cid||fnTool.getCid();
		comment.set(obj);
		Comment.dbTool.db_insert(comment.getComment(), function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn&&fn("ERROR");
			}
			//插入是100%成功?
			fn&&fn(data);
		});

		return comment;
	},
	/**
	 * 异步删除comment
	 * @param  {Number}   cid 要删除的comment的cid
	 * @param  {Function} fn  回调函数
	 */
	deleteAsync: function(bid, fn) {
		
		var _this = this;

		Comment.dbTool.db_update({"cid":bid},{"$set":{"isDelete":true}},function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn&&fn("ERROR");
			}

			fn(data);
		});
	}

};

module.exports = CommentMapper;