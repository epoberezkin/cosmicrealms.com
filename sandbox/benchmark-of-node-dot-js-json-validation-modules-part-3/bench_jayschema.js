"use strict";

var generate = require("./generate.js"),
	test_schema = require("./test_schema"),
	jayschema = new (require("jayschema"))(),
	assert = require("assert");

// No speed difference compared to pre-registering the schema
var schema = test_schema.schema4;
var i=0, max=20000, start, end;
var valids = generate.valid(max);
var invalids = generate.invalid(max);

start = Date.now();
for(i=0;i<max;i++)
{
	assert.strictEqual(jayschema.validate(valids[i], schema).length, 0);
}
end = Date.now();

console.log("jayschema v4 valids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

start = Date.now();
for(i=0;i<max;i++)
{
	assert.notStrictEqual(jayschema.validate(invalids[i], schema).length, 0);
}
end = Date.now();

console.log("jayschema v4 invalids time (" + (end-start) + ") and per document time: " + ((end-start)/max));

