"use strict";

var base = require("node-base"),
	step = require("step"),
	util = require("util"),
	path = require("path"),
	runUtils = require("node-utils").run;

var basePath = path.join(__dirname, "..");
var srcPath = path.join(basePath, "src");
var targetPath = path.join(basePath, "pub");
var stylusBin = path.join(basePath, "node_modules/.bin/stylus");

step(
	function makeDirectories()
	{
		runUtils.run("mkdir", ["-p", path.join(targetPath, "css")], this.parallel());
		runUtils.run("mkdir", ["-p", path.join(targetPath, "images")], this.parallel());
	},
	function copyFiles(err)
	{
		if(err)
			throw err;

		runUtils.run("rsync", ["-avL", path.join(srcPath, "root", "/"), targetPath], this.parallel());
		runUtils.run("rsync", ["--delete", "-avL", path.join(srcPath, "images"), targetPath], this.parallel());
	},
	function compileCSSFiles(err)
	{
		if(err)
			throw err;

		runUtils.run(stylusBin, ["-o", path.join(targetPath, "css"), path.join(srcPath, "styl", "style.styl")], this.parallel());
	},
	function finish(err)
	{
		if(err)
		{
			base.error("%R", "BUILD FAILURE".repeat(5, " "));
			base.error(err);
			base.error("%R", "EXITING DUE TO BUILD FAILURE");
			process.exit(-1);
		}
	}
);