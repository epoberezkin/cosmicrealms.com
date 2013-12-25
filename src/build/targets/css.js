"use strict";

var base = require("xbase"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	path = require("path"),
	runUtil = require("xutil").run;

var runOptions = {"redirect-stderr" : false};

module.exports = function(basePath, srcPath, targetPath, cb)
{
	var stylusBin = path.join(basePath, "node_modules/.bin/stylus");
	
	tiptoe(
		function makeDirectories()
		{
			runUtil.run("mkdir", ["-p", path.join(targetPath, "css")], runOptions, this);
		},
		function copyFiles()
		{
			runUtil.run("rsync", ["-avL", path.join(srcPath, "css"), targetPath], runOptions, this.parallel());
			runUtil.run(stylusBin, ["-o", path.join(targetPath, "css"), path.join(srcPath, "styl", "style.styl")], runOptions, this.parallel());
		},
		function finish(err) { cb(err); }
	);
};
