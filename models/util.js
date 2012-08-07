 /**
 * 判断是否有字符
 * 
 * @param {String} String 字符
 * @return {Boolean} Boolean 返回布尔值
 *            @example
 *            'abc'.hasString('a');
 *            'abc'.hasString(['a','b']);
 */
String.prototype.hasString = function(o) {
	if (typeof o == 'object') {
		for (var i = 0,n = o.length;i < n;i++) {
			if (!this.hasString(o[i])) return false;
		}
		return true;
	}
	else if (this.indexOf(o) != -1) return true;
}

exports.extend = function(subClass,superClass) {
	function F() {};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.construction = subClass;
}

exports.clone = function(object) {
	var newObject = new Object(),
		i;

	for(i in object) {
		if(Object.hasOwnProperty.call(object,i)) {
			newObject[i] = object[i];
		}
	}
	return newObject;
}

exports.isString = function(str) {
	var getClass = Object.prototype.toString;

	return getClass(str) === "[object String]";
}

exports.isObject = function(str) {
	var getClass = Object.prototype.toString;

	return getClass(str) === "[object Object]";
}

exports.isArray = function(array) {
	var getClass = Object.prototype.toString;

	return getClass(array) === "[object Array]";
}

/**
 * 格式化时间对象
 * 
 * @param {Date} v 时间对象
 * @param {String} f 时间格式
 * @return {String} 返回时间字符串
 *            @example
 *            var date = util.parseDate(new Date(),'yyyy-MM-dd hh:mm:ss');
 */
exports.parseDate = function(v,f) {
	if (!f) f = 'yyyy-MM-dd';
	f = f.replace(/\W/g,',').split(',');
	var y = null,M = null,d = null,h = null,m = null,s = null;

	f.forEach(function(o){
		if (o != '') {
			if (o.hasString('y')) y = v.getFullYear();
			if (o.hasString('M')) {
				M = v.getMonth() + 1;
				if(M.toString().length < 2) M="0"+M;
			}
			if (o.hasString('d')) {
				d = v.getDate();
				if(d.toString().length < 2) d="0"+d;
			}
			if (o.hasString('h')) {
				h = v.getHours();
				if(h.toString().length <2) h="0"+h;
			}
			if (o.hasString('m')) {
				m = v.getMinutes();
				if(m.toString().length <2) m="0"+m;
			}
			if (o.hasString('s')) s = v.getMilliseconds();
		}
	});

	var f = [], b = [];
	[y,M,d].forEach(function(n) {
		if(n !== null) f.push(n);
	});
	f = f.join("-");
	[h,m,s].forEach(function(n) {
		if(n !== null) b.push(n);
	});
	b = b.join(":");
	
	return (f !== ""? f : "") + (b !== ""? (f !== ""? " "+b: b) : "");
}