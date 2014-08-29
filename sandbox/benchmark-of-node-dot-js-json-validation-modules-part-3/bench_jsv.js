"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	jsv = require("JSV").JSV.createEnvironment("json-schema-draft-03"),
	assert = require("assert");

var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);

var schema = jsv.createSchema(test_schema.schema3);

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(schema.validate(valids[i]).errors.length, 0);
}
end = Date.now();

console.log("JSV v3 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.notStrictEqual(schema.validate(invalids[i]).errors.length, 0);
}
end = Date.now();

console.log("JSV v3 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));
