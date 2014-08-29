"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	schemaModule = require("schema")(),
	assert = require("assert");

var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);

var schema = schemaModule.Schema.create(test_schema.schema2);

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(schema.validate(valids[i]).isError(), false);
}
end = Date.now();

console.log("schema v2 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(schema.validate(invalids[i]).isError(), true);
}
end = Date.now();

console.log("schema v2 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
