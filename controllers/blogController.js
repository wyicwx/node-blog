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
	};

blog.indexAction = function(req,res) {
	var skip = (req.params.p > 0 ? req.params.p-1 : 0)*10;
	
	var eventproxy = new EventProxy(),
		blogmapper = new global.Routing.models.Model_BlogMapper(),
		tagmapper = new global.Routing.models.Model_TagMapper(),
		archivemapper = new global.Routing.models.Model_ArchiveMapper(),
		handle, blogconditions;

	handle = function(blogs, tags, archives) {
		if(blogs === "ERROR") {
			res.end(blogmapper.error);
		} 
		if(!blogs || blogs.length < 1) throw new Error("404");

		res.template({
			layout:true,
			blogs:blogs,
			tags:tags,
			archives:archives,
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		});
	};

	eventproxy.assign("blogs","tags","archives",handle);

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
	})

	archivemapper.findAsync(archiveconditions, function(data) {
		eventproxy.trigger("archives", data);
	})
}

blog.articleAction = function(req,res) {
	var bid = req.params.bid,
		eventproxy = new EventProxy(),
		blogmapper, archivemapper;

	if(!bid || isNaN(bid = parseInt(bid,10))) {
		return res.redirect("/");
	}

	blogmapper = new global.Routing.models.Model_BlogMapper();
	tagmapper = new global.Routing.models.Model_TagMapper();
	archivemapper = new global.Routing.models.Model_ArchiveMapper(),

	handle = function(blog, tags, archives) {
		res.template({
			layout: true,
			blog: blog,
			tags: tags,
			archives: archives,
			globalParam:global.Routing.models.Model_Function.getGlobalParam(req)
		});
	};

	eventproxy.assign("blog","tags","archives",handle);

	blogmapper.getBlogByBidAsync(bid, function(data) {
		eventproxy.trigger("blog",data);
	});

	tagmapper.findAsync(tagconditions, function(data) {
		eventproxy.trigger("tags", data);
	});

	archivemapper.findAsync(archiveconditions, function(data) {
		eventproxy.trigger("archives", data);
	})
}

blog.addCommentAction = function(req,res) {
	if(req.method.toLowerCase() === "get") return res.redirect("/");

	var blogmapper,
		eventproxy = new EventProxy(),
		body = req.body;

	blogmapper = new global.Routing.models.Model_BlogMapper();
	blogmapper.addCommentAsync(body.bid, body, function(data) {
		return res.redirect("/blog/article/bid/"+body.bid);
	});
}