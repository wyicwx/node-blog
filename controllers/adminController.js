var admin = exports,
	EventProxy = require("eventproxy").EventProxy,
	querystring = require("querystring"),
	getSanitizingConverter = require("../public/pagedown/Markdown.Sanitizer").getSanitizingConverter,
	saneConv = getSanitizingConverter(),
	topicconditions = {
		obj : {},
		opt : {},
		ot 	: {
			"sort":{"date":1},
			"limit":10
		}
	};

admin.indexAction = function(req,res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
}

admin.homeAction = function(req,res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
	var topicmapper = new global.Routing.models.Model_TopicMapper(),
		eventproxy = new EventProxy(), handle;

	handle = function(topics) {
		res.template({
			layout: true,
			topics: topics,
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		});
	};

	eventproxy.assign("topics",handle);

	topicmapper.findAsync(topicconditions, function(data) {
		eventproxy.trigger("topics", data);
	});

}

admin.createAction = function(req,res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
	var body = req.body,
		blogmapper = new global.Routing.models.Model_BlogMapper(),
		archivemapper = new global.Routing.models.Model_ArchiveMapper(),
		tags = [], blog;

	body.author = req.session.admin;

	["title","content"].forEach(function(n) {
		if(body[n] == "") {
			return res.end("ERROR_CREATE_" + n.toUpperCase() + "NOTFOUND");
		}
	})
	body.md = body.content;
	body.content = saneConv.makeHtml(body.content);
	body.tags.split("|").forEach(function(n) {
		if(n === "") return false;
		tags.push(n);
	})
	body.tags = tags;

	blog = blogmapper.saveAsync(body, function(data) {
		if(data === "ERROR") {
			return res.end(blogmapper.error);
		}
		return res.end("<script>alert('发表成功');location.href='/admin/home'</script>");
	});

	archivemapper.saveAsync(blog.get("bid"));

}

admin.loginAction = function(req,res) {
	var adminmapper = new global.Routing.models.Model_AdminMapper(), 
		username = req.body.username,
		password = req.body.password;

	if(req.method.toLowerCase() === "get") {
		res.template({layout:true,globalParam:global.Routing.models.Model_Function.getGlobalParam(req)});
		return;
	}

	[username, password].forEach(function(n) {
		if(!n) {
			res.end("<script>alert('请完整输入帐号密码');location.href='/admin/login'</script>");
		}
	})

	adminmapper.checkAsync(username, password, function(hasUser) {
		if(!hasUser) {
			return res.end("<script>alert('帐号不存在');location.href='/admin/login'</script>");
		}
		req.session.admin = hasUser.nickname;
		req.session.username = hasUser.username;
		res.redirect("/admin/home");
	});
}

admin.logoutAction = function(req, res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
	delete req.session.admin;
	delete req.session.username;
	res.redirect("/");
}

admin.setTopAction = function(req, res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
	var blogmapper, bid;
	res.writeHead(200, {
		'Content-Type': 'text/html'
	})
	bid = req.params.bid || req.body.bid;
	if(!bid) {
		res.end('{success:0}');
		return;
	}
	bid = parseInt(bid, 10);

	blogmapper = new global.Routing.models.Model_BlogMapper();
	blogmapper.setTopAsync(bid, function(data) {
		if(data == "ERROR") {
			res.end('{"success":0,"error":blogmapper.error}');
			return;
		}
		res.end('{"success":1}');
	});
}

admin.unsetTopAction = function(req, res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
	var blogmapper, bid;
	res.writeHead(200, {
		'Content-Type': 'text/html'
	})
	bid = req.params.bid || req.body.bid;
	if(!bid) {
		res.end('{"success":0}');
		return;
	}
	bid = parseInt(bid, 10);

	blogmapper = new global.Routing.models.Model_BlogMapper();
	blogmapper.unsetTopAsync(bid, function(data) {
		if(data == "ERROR") {
			res.end('{"success":0,"error":'+blogmapper.error+'}');
			return;
		}
		res.end('{"success":1}');
	});
}

admin.editAction = function(req, res) {
	if(!req.session.admin) {
		return res.redirect("/admin/login");
	}
	var bid = req.params.bid || req.body.bid,
		blogmapper = new global.Routing.models.Model_BlogMapper(),
		eventproxy, topicmapper, updateObj, tags;

	bid = parseInt(bid, 10);
	
	if(req.method == "GET") {
		eventproxy = new EventProxy();
		topicmapper = new global.Routing.models.Model_TopicMapper();

		handle = function(blog, topics) {
			res.template({
				layout: true,
				topics: topics,
				blog: blog,
				globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
			});
		};

		eventproxy.assign("blog", "topics", handle);

		topicmapper.findAsync(topicconditions, function(data) {
			eventproxy.trigger("topics", data);
		});

		blogmapper.getBlogByBidAsync(bid, function(data) {
			if(data == "ERROR") {
				res.end('{"success":0,"error":'+blogmapper.error+'}');
				return;
			}
			eventproxy.trigger("blog", data);
		})

	} else {
		updateObj = {}, tags = [];
		updateObj.title = req.body.title;
		updateObj.md = req.body.content;
		updateObj.content = saneConv.makeHtml(req.body.content);
		req.body.tags.split("|").forEach(function(n) {
			if(n === "") return false;
			tags.push(n);
		})
		updateObj.tags = tags;
		blogmapper.updateAsync(bid, updateObj, function(data) {
			if(data == "ERROR") {
				res.end("<script>alert('出错了，review下代码吧!')</script>");
			} else {
				res.end("<script>alert('修改成功了');\
					location.href = '/blog/article/bid/"+bid+"';\
					</script>");
			}
		})
	}
}