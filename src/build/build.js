"use strict";

var base = require("xbase"),
	util = require("util"),
	path = require("path");

var basePath = path.join(__dirname, "../..");
var srcPath = path.join(basePath, "src");
var targetPath = path.join(basePath, "pub");

var TARGET_NAMES = ["root", "legacy", "cursors", "images", "css", "js", "posts"];
var targetNames = TARGET_NAMES.slice();

if(process.argv.length>2)
	targetNames = process.argv.slice(2);

function runNextTarget(err)
{
    if(err)
    {
        base.error("BUILD FAILURE".repeat(5, " "));
        base.error(err);
        base.error("EXITING DUE TO BUILD FAILURE");
        process.exit(-1);
    }

    if(!targetNames.length)
    {
        base.info("DONE. BUILD SUCCESSFUL!\n");
        process.exit(0);
    }

    var targetName = targetNames.shift();

    if(!TARGET_NAMES.contains(targetName))
    {
        base.error("Invalid target: %s", targetName);
        base.error("Valid targets: %s", TARGET_NAMES.join(", "));
        process.nextTick(runNextTarget);
    }
    else
    {
        base.info("BUILDING: %s\n", targetName);
        require("./targets/" + targetName)(basePath, srcPath, targetPath, runNextTarget);
    }
}

runNextTarget();
