"use strict";

var base = require("node-base"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	path = require("path"),
	runUtils = require("node-utils").run;

module.exports = function(basePath, srcPath, targetPath, cb)
{
	var stylusBin = path.join(basePath, "node_modules/.bin/stylus");
	
	tiptoe(
		function makeDirectories()
		{
			runUtils.run("mkdir", ["-p", path.join(targetPath, "css")], this);
		},
		function copyFiles()
		{
			runUtils.run("rsync", ["-avL", path.join(srcPath, "css"), targetPath], this.parallel());
			runUtils.run(stylusBin, ["-o", path.join(targetPath, "css"), path.join(srcPath, "styl", "style.styl")], this.parallel());
		},
		function finish(err) { cb(err); }
	);
};
