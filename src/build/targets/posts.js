"use strict";

var base = require("node-base"),
	step = require("step"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtils = require("node-utils").dust,
	dateFormat = require("dateformat"),
	runUtils = require("node-utils").run;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	var _getPost = function(blogData, postid, cb)
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

				post.dateHuman = dateFormat(post.date, "mmm dS, yyyy");
				post.dateComputer = dateFormat(post.date, "isoDateTime");
				post.dateShortHuman = dateFormat(post.date, "mmm dd");
				post.contentPath = path.join(srcPath, "posts", postid);
				post.id = postid;
				post.author = blogData.author;
				post.fullURLPath = blogData.baseURL + post.urlPath;

				this.post = post;

				dustUtils.render(post.contentPath, "content", post, this);
			},
			function returnPost(err, postContent)
			{
				this.post.content = postContent;

				cb(err, this.post);
			}
		);
	};

	var _getPosts = function(blogData, cb)
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
						_getPost(blogData, file, cb);
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
		function createBlogDirectories()
		{
			runUtils.run("mkdir", ["-p", path.join(targetPath, "blog")], this.parallel());
			runUtils.run("mkdir", ["-p", path.join(targetPath, "blog", "archives")], this.parallel());
		},
		function getBlogJSON(err)
		{
			if(err)
				throw err;

			fs.readFile(path.join(srcPath, "config.json"), "utf8", this);
		},
		function getPosts(err, blogJSON)
		{
			if(err)
				throw err;

			var blogData = JSON.parse(blogJSON);
			blogData.currentYear = (new Date()).getFullYear();

			this.blogData = blogData;

			_getPosts(blogData, this);
		},
		function processPosts(err, posts)
		{
			if(err)
				throw err;

			var recentPosts = [];
			for(var i=0,len=posts.length;i<5 && i<len;i++)
			{
				recentPosts.push({href : posts[i].urlPath, title : posts[i].title});
			}

			this.posts = posts;

			var blogData = this.blogData;
			blogData.recentPosts = recentPosts;
			blogData.lastUpdated = dateFormat(posts[0].date, "isoDateTime");

			posts.serialForEach(function(post, cb)
			{
				var postPath = path.join(targetPath, post.urlPath);

				var dustData = { showComments : true };
				dustData.post = post;
				dustData.blog = blogData;

				step(
					function createDirectory()
					{
						runUtils.run("mkdir", ["-p", postPath], this);
					},
					function renderPost(err)
					{
						if(err)
							throw err;

						dustUtils.render(path.join(srcPath, "dust"), "single_post", dustData, this);
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
		function generateAtomXML(err)
		{
			if(err)
				throw err;

			var dustData = {};
			dustData.posts = this.posts;
			dustData.blog = this.blogData;

			dustUtils.render(path.join(srcPath, "dust"), "atom", dustData, this);
		},
		function saveAtomXML(err, atomXML)
		{
			if(err)
				throw err;

			fs.writeFile(path.join(targetPath, "atom.xml"), atomXML, "utf8", this.parallel());
		},
		function generateIndexHTML(err)
		{
			if(err)
				throw err;

			var dustData = {};
			dustData.posts = this.posts.slice(0, 10);
			dustData.blog = this.blogData;
			if(this.posts.length>1)
				dustData.hasMorePosts = true;

			dustUtils.render(path.join(srcPath, "dust"), "index", dustData, this);
		},
		function saveIndexHTML(err, indexHTML)
		{
			if(err)
				throw err;

			fs.writeFile(path.join(targetPath, "index.html"), indexHTML, "utf8", this);
		},
		function generateArchivesHTML(err)
		{
			if(err)
				throw err;

			var dustData = {};
			dustData.blog = this.blogData;

			var lastYear = null;
			this.posts.forEach(function(post)
			{
				var year = post.date.getFullYear();
				if(year!==lastYear)
				{
					post.newYear = year;
					lastYear = year;
				}
			});

			dustData.posts = this.posts;

			dustUtils.render(path.join(srcPath, "dust"), "archives", dustData, this);
		},
		function saveArchivesHTML(err, archivesHTML)
		{
			if(err)
				throw err;

			fs.writeFile(path.join(targetPath, "blog", "archives", "index.html"), archivesHTML, "utf8", this);
		},
		function finish(err) { cb(err); }
	);
};
