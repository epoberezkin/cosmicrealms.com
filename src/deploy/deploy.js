"use strict";

var base = require("node-base"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtils = require("node-utils").dust,
	runUtils = require("node-utils").run;

var basePath = path.join(__dirname, "../..");
var srcPath = path.join(basePath, "pub");

tiptoe(
	function copyFiles()
	{
		runUtils.run("rsync", ["--delete", "-avL", path.join(srcPath, "/"), "opal:/srv/cosmicrealms.com/"], this.parallel());
		runUtils.run("scp", [path.join(basePath, "nginx", "cosmicrealms.com.conf"), "opal:/srv/"], this.parallel());
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

