"use strict";

var base = require("node-base"),
	step = require("step"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtils = require("node-utils").dust,
	runUtils = require("node-utils").run;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	var _getPost = function(postid, cb)
	{
		step(
			function getMetaJSON()
			{
				fs.readFile(path.join(srcPath, "posts", postid, "meta.json"), "utf8", this);
			},
			function processMetaJSON(err, metaJSON)
			{
				if(err)
					throw err;

				var post = JSON.parse(metaJSON);
				
				var dateParts = /([01]?[0-9])-([0123]?[0-9])-([0-9][0-9][0-9][0-9]) ([0-9]?[0-9]):([0-9][0-9])/.exec(post.date);
				if(!dateParts || dateParts.length!==6)
					throw new Error("Invalid date [" + post.date + "]");
				post.date = new Date(+dateParts[3], ((+dateParts[1])-1), +dateParts[2], +dateParts[4], +dateParts[5]);

				var month = ""+(post.date.getMonth()+1);
				if(month.length<2)
					month = "0" + month;

				var day = ""+post.date.getDate();
				if(day.length<2)
					day = "0" + day;

				post.urlPath = "/blog/" + post.date.getFullYear() + "/" + month + "/" + day + "/" + postid;

				post.contentPath = path.join(srcPath, "posts", postid);
				post.id = postid;

				this(null, post);
			},
			function returnPost(err, post)
			{
				cb(err, post);
			}
		);
	};

	var _getPosts = function(cb)
	{
		step(
			function readDir()
			{
				fs.readdir(path.join(srcPath, "posts"), this);
			},
			function process(err, files)
			{
				if(err)
					throw err;

				var hasPosts = false;
				var postids = [];

				files.serialForEach(function(file, cb)
				{
					if(fs.statSync(path.join(srcPath, "posts", file, "meta.json")).isFile())
					{
						hasPosts = true;
						_getPost(file, cb);
					}
				}, this);
			},
			function returnPosts(err, posts)
			{
				posts.sort(function(a, b)
				{
					return b.date.getTime()-a.date.getTime();
				});

				cb(err, posts);
			}
		);
	};

	step(
		function createBlogDirectory()
		{
			runUtils.run("mkdir", ["-p", path.join(targetPath, "blog")], this);
		},
		function getBlogJSONAndPosts(err)
		{
			if(err)
				throw err;

			fs.readFile(path.join(srcPath, "config.json"), "utf8", this.parallel());
			_getPosts(this.parallel());
		},
		function processPosts(err, blogJSON, posts)
		{
			if(err)
				throw err;

			var blogData = JSON.parse(blogJSON);
			blogData.currentYear = (new Date()).getFullYear();

			var recentPosts = [];
			for(var i=0,len=posts.length;i<5 && i<len;i++)
			{
				recentPosts.push({href : posts[i].urlPath, title : posts[i].title});
			}
			blogData.recentPosts = recentPosts;

			posts.serialForEach(function(post, cb)
			{
				var postPath = path.join(targetPath, post.urlPath);

				post.blog = blogData;

				step(
					function createDirectory()
					{
						runUtils.run("mkdir", ["-p", postPath], this);
					},
					function renderPostPart(err)
					{
						if(err)
							throw err;

						dustUtils.render(post.contentPath, "content", post, this);
					},
					function renderPost(err, postPart)
					{
						if(err)
							throw err;

						base.info(postPart);
						dustUtils.render(path.join(srcPath, "dust"), "post", post, this);
					},
					function savePost(err, postHTML)
					{
						if(err)
							throw err;

						fs.writeFile(path.join(postPath, "index.html"), postHTML, "utf8", this);
					},
					function finish(err) { cb(err); }
				);
			}, this);
		},
		function finish(err) { cb(err); }
	);
};
