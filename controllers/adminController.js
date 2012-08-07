var admin = exports,
	EventProxy = require("eventproxy").EventProxy,
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