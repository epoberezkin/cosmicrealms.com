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
			runUtils.run("mkdir", ["-p", path.join(targetPath, "cursors")], this);
		},
		function copyFiles()
		{
			runUtils.run("rsync", ["--delete", "-avL", path.join(srcPath, "cursors"), targetPath], this);
		},
		function finish(err) { cb(err); }
	);
};
