"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	schemaModule = require("schema")(),
	assert = require("assert");

var schema = schemaModule.Schema.create(test_schema.schema2);
var valid = test_object.valid;
var invalid = test_object.invalid;

assert.strictEqual(schema.validate(invalid).isError(), true);
assert.strictEqual(schema.validate(valid).isError(), false);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	schema.validate(valid);
}
end = Date.now();

console.log("schema v2 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
