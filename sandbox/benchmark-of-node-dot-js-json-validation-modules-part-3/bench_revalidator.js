"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	revalidator = require("revalidator"),
	assert = require("assert");

var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);
var schema = test_schema.schema4;

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(revalidator.validate(valids[i], schema).valid, true);
}
end = Date.now();

console.log("revalidator v4 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(revalidator.validate(invalids[i], schema).valid, false);
}
end = Date.now();

console.log("revalidator v4 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
