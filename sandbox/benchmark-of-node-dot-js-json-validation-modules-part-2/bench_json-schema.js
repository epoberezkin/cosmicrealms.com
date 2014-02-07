"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	jsonSchema = require("json-schema"),
	assert = require("assert");

var schema = test_schema.schema3;
var valid = test_object.valid;
var invalid = test_object.invalid;

assert.notStrictEqual(jsonSchema.validate(invalid, schema).errors.length, 0);
assert.strictEqual(jsonSchema.validate(valid, schema).errors.length, 0);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	jsonSchema.validate(valid, schema);
}
end = Date.now();

console.log("json-schema v3 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
