"use strict";

var base = require("node-base"),
	step = require("step"),
	util = require("util"),
	path = require("path"),
	runUtils = require("node-utils").run;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	var stylusBin = path.join(basePath, "node_modules/.bin/stylus");
	
	step(
		function makeDirectories()
		{
			runUtils.run("mkdir", ["-p", path.join(targetPath, "css")], this);
		},
		function copyFiles(err)
		{
			if(err)
				throw err;

			runUtils.run(stylusBin, ["-o", path.join(targetPath, "css"), path.join(srcPath, "styl", "style.styl")], this);
		},
		function finish(err) { cb(err); }
	);
};
