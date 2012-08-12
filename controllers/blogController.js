var blog = exports,
	EventProxy = require("eventproxy").EventProxy,
	tagconditions = {
		obj : {
			"size":{"$gt":0}
		},
		opt : {},
		ot : {
			"sort":{"size":1},
			"limit":10
		}
	},
	archiveconditions = {
		obj : {},
		opt : {},
		ot 	: {
			"sort":{"date":1}
		}
	},
	md5 = require("ezcrypto").Crypto.MD5;

blog.indexAction = function(req,res) {
	var pages = req.params.p, skip;
		
		pages = (pages < 0 || !pages) ? 1 : parseInt(pages, 10);
		skip = (pages - 1) * 10;

	var eventproxy = new EventProxy(),
		blogmapper = new global.Routing.models.Model_BlogMapper(),
		tagmapper = new global.Routing.models.Model_TagMapper(),
		archivemapper = new global.Routing.models.Model_ArchiveMapper(),
		handle, blogconditions, topconditions;

	handle = function(blogs, tags, archives, tops) {
		if(blogs === "ERROR") {
			res.end(blogmapper.error);
		} 
		if(!blogs || blogs.length < 1) throw new Error("404");

		res.template({
			layout:true,
			blogs:blogs,
			tags:tags,
			archives:archives,
			tops:tops,
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		});
	};

	eventproxy.assign("blogs","tags","archives","tops",handle);

	blogconditions = {
		obj : {
			"isDelete":{"$ne":true},
			"isTop":{"$ne":true}
		},
		opt : {

		},
		ot : {
			"sort":{"editdate":-1},
			"limit":10,
			"skip":skip
		}
	}

	blogmapper.findAsync(blogconditions, function(data) {
		eventproxy.trigger("blogs",data);
	});

	tagmapper.findAsync(tagconditions, function(data) {
		eventproxy.trigger("tags", data);
	});

	archivemapper.findAsync(archiveconditions, function(data) {
		eventproxy.trigger("archives", data);
	});

	if(pages == 1) {
		topconditions = {
			obj : {
				"isDelete":{"$ne":true},
				"isTop":true
			},
			opt : {

			},
			ot : {
				"sort":{"setTopDate":-1}
			}
		}

		blogmapper.findAsync(topconditions, function(data) {
			eventproxy.trigger("tops",data);
		});
	} else {
		eventproxy.trigger("tops", {});
	}
}

blog.articleAction = function(req,res) {
	var bid = req.params.bid,
		eventproxy = new EventProxy(),
		blogmapper;

	if(!bid || isNaN(bid = parseInt(bid,10))) {
		return res.redirect("/");
	}

	blogmapper = new global.Routing.models.Model_BlogMapper();

	handle = function(blog, other) {
		res.template({
			layout: true,
			blog: blog,
			tags: other.tags,
			archives: other.archives,
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		});
	};

	eventproxy.assign("blog","other",handle);

	blogmapper.getBlogByBidAsync(bid, function(data) {
		eventproxy.trigger("blog",data);
	});

	blog.layout(function(data) {
		eventproxy.trigger("other", data);
	})
}

blog.addCommentAction = function(req,res) {
	if(req.method.toLowerCase() === "get") return res.redirect("/");

	var blogmapper,
		eventproxy = new EventProxy(),
		body = req.body;

	body.avatar = md5(body.email);
	blogmapper = new global.Routing.models.Model_BlogMapper();
	blogmapper.addCommentAsync(body.bid, body, function(data) {
		return res.redirect("/blog/article/bid/"+body.bid);
	});
}

blog.searchAction = function(req, res) {
	var tag = req.params.tag, 
		archive = req.params.archive; 

	if(tag) {
		blog.tag(req, res);
	} else if(archive) {
		blog.archive(req, res);
	}
}

blog.archive = function(req, res) {
	var archive = decodeURIComponent(req.params.archive),
		archivemapper, blogmapper, eventproxy = new EventProxy(),
		p = req.params.p, skip, handle;

	skip = (p <= 1 ? 0 : p-1) * 10;

	handle = function(blogs, other) {
		res.render("blog/index", {
			blogs: blogs,
			tags: other.tags,
			archives: other.archives,
			tops: [],
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		})
	}

	blog.layout(function(data) {
		eventproxy.trigger("other", data);
	});

	eventproxy.assign("blogs", "other", handle);

	archivemapper = new global.Routing.models.Model_ArchiveMapper();
	archivemapper.findOneAsync({"archive": archive}, function(data) {
		if(data == "ERROR") {
			res.redirect('/');
			return;
		}
		if(!data) {
			res.end("<script>alert('参数错误');location.href='/';</script>");
			return;
		}
		blogmapper = new global.Routing.models.Model_BlogMapper();
		blogmapper.findAsync({
			obj: {
				bid: {
					"$in": data.bids
				}
			},
			opt : {},
			ot : {
				"sort": {"editdate":-1},
				"limit": 10,
				"skip": skip
			}
		}, function(data) {
			if(data == "ERROR") {
				console.log(blogmapper.error);
				res.end("ERROR");
				return;
			}
			eventproxy.trigger("blogs", data);
		})
	})

}

blog.tag = function(req, res) {
	var tag = req.params.tag, eventproxy = new EventProxy(),
		handle, tagmapper, blogmapper, p = req.params.p, skip;

	skip = (p <= 1 ? 0 : p-1) * 10;
	tag = decodeURIComponent(tag);

	handle = function(blogs, other) {

		res.render("blog/index",{
			layout: true,
			blogs: blogs,
			tags: other.tags,
			archives: other.archives,
			tops: [],
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		})
	}

	eventproxy.assign("blogs", "other", handle);

	tagmapper = new global.Routing.models.Model_TagMapper();
	tagmapper.findOneAsync({tag: tag}, function(data) {
		if(data == "ERROR") {
			res.end("ERROR");
			return;
		}
		if(!data) {
			res.end("NOT EXIST");
			return;
		}
		blogmapper = new global.Routing.models.Model_BlogMapper();
		blogmapper.findAsync({
			obj: {
				tags : data.tag
			},
			opt: {},
			ot: {
				"sort": {"editdate":-1},
				"limit": 10,
				"skip": skip
			}
		}, function(data) {
			if(data == "ERROR") {
				console.log(blogmapper.error);
				res.end("ERROR");
				return;
			}
			eventproxy.trigger("blogs", data);
		})	
	})

	blog.layout(function(data) {
		eventproxy.trigger("other", data);
	})


}

blog.layout = function(fn) {

	var eventproxy = new EventProxy(),
		tagmapper = new global.Routing.models.Model_TagMapper(),
		archivemapper = new global.Routing.models.Model_ArchiveMapper(),
		handle;

	handle = function(tags, archives) {
		fn({
			tags: tags,
			archives: archives
		});
	};

	eventproxy.assign("tags","archives",handle);

	tagmapper.findAsync(tagconditions, function(data) {
		eventproxy.trigger("tags", data);
	});

	archivemapper.findAsync(archiveconditions, function(data) {
		eventproxy.trigger("archives", data);
	});

}