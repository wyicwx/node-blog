/**
 * BlogMapper
 * @author wyicwx
 * @fileOverview  blog集合相关操作
 */
var Blog = require("./blog.js"), 
	Comment = require("./comment.js"),
	CommentMapper = require("./commentMapper.js"),
	TagMapper = require("./tagMapper.js"),
	fnTool = require("./function.js");

/**
 * @constructor BlogMapper
 * @description blog集合相关操作
 */
function BlogMapper() {
	this.isError = false;
	this.error = null;
}

BlogMapper.prototype = {
	/**
	 * 异步存储blog
	 * @param  {Object}   obj 存储blog属性对象
	 * @param  {Function} fn  回调函数
	 * @return {Object}       blog对象
	 */
	saveAsync: function(obj, fn) {
		
		var blog = new Blog(), _this = this, tagmapper;

		obj.bid = obj.bid||fnTool.getBid();
		blog.set(obj);
		
		//保存标签
		if(blog.get("tags").length > 0) {
			tagmapper = new TagMapper();
			for(var i in blog.get("tags")) {
				tagmapper.saveAsync(blog.get("tags")[i]);
			}
		}
		Blog.dbTool.db_insert(blog.getBlog(), function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn&&fn("ERROR");
			}
			//插入是100%成功?
			return fn&&fn(data);
		});
		
		return blog;
	},
	/**
	 * 异步删除blog
	 * @param  {Number}   bid 要删除的blog的bid
	 * @param  {Function} fn  回调函数
	 */
	deleteAsync: function(bid, fn) {
		
		var _this = this;

		Blog.dbTool.db_update({"bid":bid},{"$set":{"isDelete":true}},function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
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

		Blog.dbTool.db_find(conditions.obj, conditions.opt, conditions.ot, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}
			
			fn(data);			
		});
	},
	/**
	 * 异步添加标签
	 * @param {Number}   bid 添加标签的blog's id
	 * @param {String}   tag 标签字符串
	 * @param {Function} fn  回调函数
	 */
	addTagAsync: function(bid, tag, fn) {
		
		var _this = this, push = "$push";

		if(util.isArray(tag)) {
			push = "$pushAll";
		}

		Blog.dbTool.db_update({"bid":bid},{"$push":{"tags":tag}}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
		});
	},
	/**
	 * 异步删除标签
	 * @param  {Number}   bid 删除标签的blog's id
	 * @param  {String}   tag 标签字符串
	 * @param  {Function} fn  回调函数
	 */
	deleteTagAsync: function(bid, tag, fn) {

		var _this = this, pull;

		if(util.isArray(tag)) {
			pull = "$pullAll";
		}
		Blog.dbTool.db_update({"bid":bid,"tags":tag},{"tags":{pull:tag}}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
		});
	},
	/**
	 * 异步置顶
	 * @param {Number}   bid 设置置顶的blog's id
	 * @param {Function} fn  回调函数
	 */
	setTopAsync: function(bid, fn) {

		var _this = this, time = new Date();

		Blog.dbTool.db_update({"bid":bid},{"$set":{"isTop":true,"setTopDate":time}}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
		});
	},
	/**
	 * 异步取消置顶
	 * @param  {Number}   bid blog's id
	 * @param  {Function} fn  回调函数
	 * @return {Undefined}       undefined
	 */
	unsetTopAsync: function(bid, fn) {

		var _this = this;

		Blog.dbTool.db_update({"bid":bid},{"$unset":{"isTop":1,"setTopDate":1}}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
		})
	},
	/**
	 * 异步获得blog文档
	 * @param  {Number}   bid blog's id
	 * @param  {Function} fn  回调函数
	 * @return {Undefined}    undefined
	 */
	getBlogByBidAsync: function(bid, fn) {

		var _this = this;

		Blog.dbTool.db_findOne({"bid":bid}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
		})
	},
	/**
	 * 异步添加评论
	 * @param {Number}   bid     blog's id
	 * @param {Comment}   c 评论相关参数
	 * @param {Function} fn      回调函数
	 * @return {Object} 	Comment对象
	 */
	addCommentAsync: function(bid, c, fn) {

		var _this = this, comment, commentmapper = new CommentMapper();

		comment = commentmapper.saveAsync(c);

		Blog.dbTool.db_update({"bid":parseInt(bid,10)},{"$push":{"comments":comment.getComment()}}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;

				return fn("ERROR");
			}
			fn(data);
		});
	},
	/**
	 * 异步删除评论
	 * @param  {Number}   bid blog's id
	 * @param  {Number}   cid comment's id
	 * @param  {Function} fn  回调函数
	 */
	deleteCommentAsync: function(bid, cid, fn) {

		var _this = this, commentmapper = new CommentMapper();

		commentmapper.deleteAsync(cid);
		Blog.dbTool.db_update({"bid":bid},{"$pull":{"comments":{"cid":cid}}}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;

				return fn("ERROR");
				
			}

			fn(data);
		})
	},
	/**
	 * 异步更新blog方法
	 * @param  {Number}   bid blog的bid
	 * @param  {Object}   obj $set的条件对象
	 * @param  {Function} fn  回调函数
	 */
	updateAsync: function(bid, obj, fn) {
		var _this = this;

		Blog.dbTool.db_update({"bid": bid},{"$set": obj}, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;

				return fn("ERROR");
			}
			fn(data);
		})
	}

}

module.exports = BlogMapper;