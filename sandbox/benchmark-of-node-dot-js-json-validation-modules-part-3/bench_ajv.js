"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	Ajv = require("ajv"),
	assert = require("assert");

var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);
var schema = Ajv().compile(test_schema.schema4);

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(schema(valids[i]), true);
}
end = Date.now();

console.log("ajv v4 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(schema(invalids[i]), false);
}
end = Date.now();

console.log("ajv v4 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
