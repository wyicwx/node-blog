var util = require("./util.js"),
	db = require("./db.js"),
	eventproxy = require("eventproxy"),
	structuresObject;

structuresObject = {
	title 	: "",
	author 	: "",
	label 	: [],
	date 	: new Date(),
	editdate: new Date(),
	content : "",
	bid 	: new Number(),
	comment : []
}

function DbBlog() {
	this.collection = "blog";
	this.index = {bid:1};
}

util.extend(DbBlog,db.Oop);

var dbBlog = new DbBlog();

//设置索引
dbBlog.db_ensureIndex();

exports.dbBlog = dbBlog;

exports.newBlog = function(obj,fn) {
	var newBlog = util.clone(structuresObject),
		i;

	newBlog.bid = util.getBid();
	newBlog.date = new Date();
	newBlog.editdate = new Date();

	for(i in newBlog) {
		if(obj[i]) {
			newBlog[i] = obj[i];
		}
	}

	dbBlog.db_insert(newBlog,fn);
}

exports.getBlogsList = function(limit,fn) {
	dbBlog.db_find({}).sort({date:-1}).limit(limit).toArray(fn);
}

exports.getBlog = function(bid,fn) {
	dbBlog.db_findOne({bid:bid},fn);
}

