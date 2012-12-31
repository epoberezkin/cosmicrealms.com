"use strict";

var base = require("node-base"),
	step = require("step"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtils = require("node-utils").dust,
	dateFormat = require("dateformat"),
	runUtils = require("node-utils").run;

var basePath = path.join(__dirname, "../..");
var srcPath = path.join(basePath, "pub");

step(
	function copyFiles()
	{
		runUtils.run("rsync", ["--delete", "-avL", path.join(srcPath, "/"), "sapphire:/srv/cosmicrealms.com/"], this.parallel());
		runUtils.run("scp", [path.join(basePath, "nginx", "cosmicrealms.com.conf"), "sapphire:/srv/"], this.parallel());
	},
	function finish(err)
	{
		if(err)
		{
			base.error("%R", "DEPLOY FAILURE".repeat(5, " "));
			base.error(err);
			base.error("%R", "EXITING DUE TO DEPLOY FAILURE");
			process.exit(-1);
		}

		process.exit(0);
	}
);

