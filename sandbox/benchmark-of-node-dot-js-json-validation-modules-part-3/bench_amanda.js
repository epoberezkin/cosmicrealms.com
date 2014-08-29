"use strict";

var base = require("xbase"),
	generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	amanda = require("amanda"),
	tiptoe = require("tiptoe"),
	assert = require("assert");

var schema = test_schema.schema4;
var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);
var finalCallback = null;

tiptoe(
	function runValids()
	{
		start = Date.now();
		valids.serialForEach(function(valid, subcb, i)
		{
			amanda.validate(valid, schema, function(err) { assert.strictEqual(err, undefined); setImmediate(subcb); });
		}, this);
	},
	function runInvalids(err)
	{
		end = Date.now();
		console.log("amanda v4 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

		start = Date.now();
		invalids.serialForEach(function(invalid, subcb)
		{
			amanda.validate(invalid, schema, function(err) { assert.notStrictEqual(err, undefined); setImmediate(subcb); });
		}, this);
	},
	function finish(err)
	{
		end = Date.now();
		console.log("amanda v4 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

		if(err)
		{
			console.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
