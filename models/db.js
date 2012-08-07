/**
 * @name: db.js
 * @author: maple
 * @overview: 数据库操作
 */

var lconfig = require('../config.js'),
	mongo = require("mongoskin");

//数据库连接设置
var dbUrl = lconfig["DB_host"] + ":" +
			lconfig["DB_ports"] + "/" +
			lconfig["DB_db"];



if((lconfig["DB_password"] != "")&&(lconfig["DB_username"] != "")) {
	dbUrl = lconfig.dbConfig["username"] + ":" + lconfig.dbConfig["password"] + "@" + dbUrl;
}

//设置数据库
var db = mongo.db(dbUrl);

/**
 * @constructor DB
 * @description 数据库操作类
 */
var DB = function(collection) {
	this.collection = collection||null;
};

/**
 * db_getDB
 * @return {Object} 获取数据库对象
 */
DB.prototype.db_getDB = function() {
	return db;
};

/**
 * 获取数据库集合
 * @return {Object} 返回collection对象
 */
DB.prototype.db_get_collection = function() {		//获取集合函数
	if(!this.collection) {
		throw new Error("subClass must define collection");
	}
	var db_pointer = db.collection(this.collection);
	return db_pointer;
};

/**
 * 插入数据库
 * @param  {Object}   obj 插入文档对象
 * @param  {Function} fn  回调函数
 * @return {Undefined}       undefined
 */
DB.prototype.db_insert = function(obj,fn) {
	if(!fn) throw new Error("callback function is need");
	this.db_get_collection().insert(obj,fn);
};

/**
 * 更新文档对象
 * @param  {Object}   obj   更对条件对象
 * @param  {Object}   obj2  新文档或添加属性
 * @param  {Function} fn    回调函数
 * @param  {Boolean}   whole 是否更新所有符合条件文档
 * @return {Undefined}         undefined
 */	
DB.prototype.db_update = function(obj,obj2,fn,whole) {
	if(!fn) throw new Error("callback function is need");
	whole = whole||false;
	this.db_get_collection().update(obj,obj2,{"upsert":false,"multi":whole},fn);
};

/**
 * 更新对象或者插入对象
 * @param  {Object}   obj   更新对象条件
 * @param  {Object}   obj2  新文档或者添加属性
 * @param  {Function} fn    回调函数
 * @param  {Boolean}   whole 是否更新所有符合条件文档
 * @return {Undefined}         undefined
 */
DB.prototype.db_upsert = function(obj,obj2,fn,whole) {
	if(!fn) throw new Error("callback function is need");
	whole = whole||false;
	this.db_get_collection().update(obj,obj2,{"upsert":true,"multi":whole},fn);
};

/**
 * 查找一个文档
 * @param  {Object}   obj 更新文档条件
 * @param  {Function} fn  回调函数
 * @return {Undefined}       undefined
 */
DB.prototype.db_findOne = function(obj,fn) {
	if(!fn) throw new Error("callback function is need");
	this.db_get_collection().findOne(obj,fn);
};

/**
 * 查找文档
 * @param  {Object}   obj 查找文档条件
 * @param  {Object}   opt [description]
 * @param  {Object}   ot  [description]
 * @param  {Function} fn  回调函数
 * @return {Undefined}       undefined
 */
DB.prototype.db_find = function(obj,opt,ot,fn) {
	if(!fn) throw new Error("callback function is need");
	this.db_get_collection().find(obj,opt,ot).toArray(fn);
};

/**
 * 设置索引
 * @return {Undefined} undefined
 */
DB.prototype.db_ensureIndex = function() {
	if(!fn) throw new Error("callback function is need");
	this.db_get_collection().ensureIndex(this.index);
};

/**
 * 获取集合总数
 * @param {Function} fn 回调函数
 */
DB.prototype.db_count = function(fn) {		//获取集合函数
	if(!this.collection) {
		throw new Error("subClass must define collection");
	}
	this.db_get_collection().count(fn);
};

module.exports = DB;

