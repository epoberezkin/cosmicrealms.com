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
		function copyFiles()
		{
			runUtil.run("rsync", ["-avL", path.join(srcPath, "legacy", "/"), targetPath], runOptions, this);
		},
		function finish(err) { cb(err); }
	);
};
