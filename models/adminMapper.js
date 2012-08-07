var Admin = require("./admin.js");

function AdminMapper() {
	this.isError = false;
	this.error = null
}

AdminMapper.prototype = {
	/**
	 * 异步存储管理员帐号
	 * @param  {Object}   obj 管理员存储属性
	 * @param  {Function} fn  回调函数
	 * @return {Undefined}       undefined
	 */
	saveAsync: function(obj, fn) {
		var admin = new Admin(), _this = this;

		admin.set(obj);
		Admin.dbTool.db_insert(admin.getAdmin(), function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = err;
				return fn("ERROR");
			}

			fn(data);
		});
	},
	/**
	 * [checkAsync description]
	 * @param  {[type]}   username [description]
	 * @param  {[type]}   password [description]
	 * @param  {Function} fn       [description]
	 * @return {[type]}            [description]
	 */
	checkAsync: function(username, password, fn) {
		var _this = this, obj = {
			username : username,
			password : password
		}
		Admin.dbTool.db_findOne(obj, function(err, data) {
			if(err) {
				_this.isError = true;
				_this.error = null;
				return fn("ERROR");
			}

			if(data) {
				return fn(data);
			} 
			fn(false);
		});
	}
}

module.exports = AdminMapper;