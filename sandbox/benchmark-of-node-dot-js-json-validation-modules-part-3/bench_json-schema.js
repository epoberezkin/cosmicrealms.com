"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	jsonSchema = require("json-schema"),
	assert = require("assert");

var schema = test_schema.schema3;
var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(jsonSchema.validate(valids[i], schema).errors.length, 0);
}
end = Date.now();

console.log("json-schema v3 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.notStrictEqual(jsonSchema.validate(invalids[i], schema).errors.length, 0);
}
end = Date.now();

console.log("json-schema v3 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

