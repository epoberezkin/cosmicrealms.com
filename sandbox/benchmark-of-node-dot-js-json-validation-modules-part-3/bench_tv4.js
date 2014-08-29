"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	tv4 = require("tv4"),
	assert = require("assert");

var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);
var schema = test_schema.schema4;

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(tv4.validate(valids[i], schema), true);
}
end = Date.now();

console.log("tv4 v4 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(tv4.validate(invalids[i], schema), false);
}
end = Date.now();

console.log("tv4 v4 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
