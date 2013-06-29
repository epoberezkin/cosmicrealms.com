"use strict";

var base = require("base"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	path = require("path"),
	runUtils = require("node-utils").run;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	tiptoe(
		function makeDirectories()
		{
			runUtils.run("mkdir", ["-p", targetPath], this);
		},
		function copyFiles()
		{
			runUtils.run("rsync", ["-avL", path.join(srcPath, "root", "/"), targetPath], this);
		},
		function finish(err) { cb(err); }
	);
};
