"use strict";

var base = require("xbase"),
	tiptoe = require("tiptoe"),
	util = require("util"),
	fs = require("fs"),
	path = require("path"),
	dustUtils = require("xutil").dust,
	runUtil = require("xutil").run;

var basePath = path.join(__dirname, "../..");
var srcPath = path.join(basePath, "pub");

tiptoe(
	function copyFiles()
	{
		runUtil.run("rsync", ["--delete", "-avL", path.join(srcPath, "/"), "opal:/srv/cosmicrealms.com/"], {"redirect-stderr" : false}, this.parallel());
		runUtil.run("scp", [path.join(basePath, "nginx", "cosmicrealms.com.conf"), "opal:/srv/"], {"redirect-stderr" : false}, this.parallel());
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

