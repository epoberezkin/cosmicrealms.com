"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	amanda = require("amanda"),
	tiptoe = require("tiptoe"),
	assert = require("assert");

var schema = test_schema.schema3;
var valid = test_object.valid;
var invalid = test_object.invalid;
var finalCallback = null;
var i=0, max=20000, start, end;

// amanda doesn't support several valid e-mails, so remove those first
valid.emailAddresses.splice(5, 5);

tiptoe(
	function runInvalid()
	{
		this.capture();
		amanda.validate(invalid, schema, this);
	},
	function testInvalid(err)
	{
		assert.notStrictEqual(err, undefined);
		this();
	},
	function runValid()
	{
		this.capture();
		amanda.validate(valid, schema, this);
	},
	function testValid(err)
	{
		assert.strictEqual(err, undefined);
		this();
	},
	function runBenchmark()
	{
		finalCallback = this;
		start = Date.now();
		setImmediate(bench);
	},
	function finish(err)
	{
		end = Date.now();

		if(err)
		{
			console.error(err);
			process.exit(1);
		}

		console.log("amanda v3 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
		process.exit(0);
	}
);

function bench()
{
	if(i===max)
		return setImmediate(finalCallback);

	i++;
	amanda.validate(valid, schema, function() { setImmediate(bench); });
}
