"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	jsonGate = require("json-gate"),
	assert = require("assert");

var schema = jsonGate.createSchema(test_schema.schema3);
var i=0, max=20000, start, end, hasError;
var valids = generate.valid(max);
var invalids = generate.invalid(max);

start = Date.now();
for(i=0;i<max;i++)
{
	hasError = false;
	try
	{
		schema.validate(valids[i]);
	}
	catch(err)
	{
		hasError = true;
	}
	assert.strictEqual(hasError, false);
}
end = Date.now();

console.log("json-gate v3 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));


start = Date.now();
for(i=0;i<max;i++)
{
	hasError = false;
	try
	{
		schema.validate(invalids[i]);
	}
	catch(err)
	{
		hasError = true;
	}

	assert.strictEqual(hasError, true);
}
end = Date.now();

console.log("json-gate v3 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
