"use strict";

var base = require("xbase"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtils = require("xutil").dust,
	moment = require("moment"),
	runUtil = require("xutil").run;

var runOptions = {"redirect-stderr" : false};
var NUM_RECENT_POSTS = 4;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	var _getPost = function(blogData, postid, cb)
	{
		tiptoe(
			function getMetaJSON()
			{
				fs.readFile(path.join(srcPath, "posts", postid, "meta.json"), "utf8", this);
			},
			function processMetaJSON(metaJSON)
			{
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

				post.dateHuman = moment(post.date).format("MMM Do, YYYY");
				post.dateComputer = moment(post.date).format("YYYY-MM-DDTHH:mm:ss");
				post.dateShortHuman = moment(post.date).format("MMM DD");
				post.contentPath = path.join(srcPath, "posts", postid);
				post.id = postid;
				post.author = blogData.author;
				post.fullURLPath = blogData.baseURL + post.urlPath;

				this.post = post;

				dustUtils.render(post.contentPath, "content", post, { keepWhitespace : true }, this);
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
		tiptoe(
			function readDir()
			{
				fs.readdir(path.join(srcPath, "posts"), this);
			},
			function process(files)
			{
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

	tiptoe(
		function createBlogDirectories()
		{
			runUtil.run("mkdir", ["-p", path.join(targetPath, "blog")], runOptions, this.parallel());
			runUtil.run("mkdir", ["-p", path.join(targetPath, "blog", "archives")], runOptions, this.parallel());
		},
		function getBlogJSON()
		{
			fs.readFile(path.join(srcPath, "config.json"), "utf8", this);
		},
		function getPosts(blogJSON)
		{
			var blogData = JSON.parse(blogJSON);
			blogData.currentYear = (new Date()).getFullYear();

			this.blogData = blogData;

			_getPosts(blogData, this);
		},
		function processPosts(posts)
		{
			var recentPosts = [];
			for(var i=0,len=posts.length;i<NUM_RECENT_POSTS && i<len;i++)
			{
				recentPosts.push({href : posts[i].urlPath, title : posts[i].title});
			}

			this.posts = posts;

			var blogData = this.blogData;
			blogData.recentPosts = recentPosts;
			blogData.lastUpdated = moment(posts[0].date).format("YYYY-MM-DDTHH:mm:ss");

			posts.serialForEach(function(post, cb)
			{
				var postPath = path.join(targetPath, post.urlPath);

				var dustData = { showComments : true };
				dustData.post = post;
				dustData.blog = blogData;

				tiptoe(
					function createDirectory()
					{
						runUtil.run("mkdir", ["-p", postPath], runOptions, this);
					},
					function renderPost()
					{
						dustUtils.render(path.join(srcPath, "dust"), "single_post", dustData, this);
					},
					function savePost(postHTML)
					{
						fs.writeFile(path.join(postPath, "index.html"), postHTML, "utf8", this);
					},
					function finish(err) { cb(err); }
				);
			}, this);
		},
		function generateAtomXML()
		{
			var dustData = {};
			dustData.posts = this.posts;
			dustData.blog = this.blogData;

			dustUtils.render(path.join(srcPath, "dust"), "atom", dustData, this);
		},
		function saveAtomXML(atomXML)
		{
			fs.writeFile(path.join(targetPath, "atom.xml"), atomXML, "utf8", this.parallel());
		},
		function generateIndexHTML()
		{
			var dustData = {};
			dustData.posts = this.posts.slice(0, NUM_RECENT_POSTS);
			dustData.blog = this.blogData;
			if(this.posts.length>1)
				dustData.hasMorePosts = true;

			dustUtils.render(path.join(srcPath, "dust"), "index", dustData, this);
		},
		function saveIndexHTML(indexHTML)
		{
			fs.writeFile(path.join(targetPath, "index.html"), indexHTML, "utf8", this);
		},
		function generateArchivesHTML()
		{
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
		function saveArchivesHTML(archivesHTML)
		{
			fs.writeFile(path.join(targetPath, "blog", "archives", "index.html"), archivesHTML, "utf8", this);
		},
		function finish(err) { cb(err); }
	);
};
