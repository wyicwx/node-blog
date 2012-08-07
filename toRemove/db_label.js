var util = require("./util.js"),
	db = require("./db.js"),
	eventproxy = require("eventproxy"),
	structuresObject;

structuresObject = {
	lid 	: new String(),
	name 	: new String(),
	blogs	: [],
	date	: new Date
}

function DbLabel() {
	this.collection = "lable";
	this.index = {name:1};
}

util.extend(DbLabel,db.Oop);

var dbLabel = new DbLabel();

//设置索引
dbLabel.db_ensureIndex();

exports.getLabel = function(name,fn) {
	dbLabel.db_findOne({name:name},fn);
}

exports.getLabelList = function(limit,fn) {
	dbLabel.db_find({}).limit(limit).sort({date:-1}).toArray(fn);
}

