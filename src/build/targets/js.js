"use strict";

var base = require("xbase"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	path = require("path"),
	runUtil = require("xutil").run;

var runOptions = {"redirect-stderr" : false};

module.exports = function(basePath, srcPath, targetPath, cb)
{
	tiptoe(
		function makeDirectories()
		{
			runUtil.run("mkdir", ["-p", path.join(targetPath, "js")], runOptions, this);
		},
		function copyFiles()
		{
			runUtil.run("rsync", ["--delete", "-avL", path.join(srcPath, "js"), targetPath], runOptions, this);
		},
		function finish(err) { cb(err); }
	);
};
