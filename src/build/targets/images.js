"use strict";

var base = require("node-base"),
	step = require("step"),
	util = require("util"),
	path = require("path"),
	runUtils = require("node-utils").run;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	step(
		function makeDirectories()
		{
			runUtils.run("mkdir", ["-p", path.join(targetPath, "images")], this);
		},
		function copyFiles(err)
		{
			if(err)
				throw err;

			runUtils.run("rsync", ["--delete", "-avL", path.join(srcPath, "images"), targetPath], this);
		},
		function finish(err) { cb(err); }
	);
};
