"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	zschema = new (require("z-schema"))(),
	assert = require("assert");

var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);
var schema = test_schema.schema4;

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(zschema.validate(valids[i], schema), true);
}
end = Date.now();

console.log("z-schema v4 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(zschema.validate(invalids[i], schema), false);
}
end = Date.now();

console.log("z-schema v4 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
