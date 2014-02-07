"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	jsv = require("JSV").JSV.createEnvironment("json-schema-draft-03"),
	assert = require("assert");

var schema = jsv.createSchema(test_schema.schema3);
var valid = test_object.valid;
var invalid = test_object.invalid;

assert.notStrictEqual(schema.validate(invalid).errors.length, 0);
assert.strictEqual(schema.validate(valid).errors.length, 0);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	schema.validate(valid);
}
end = Date.now();

console.log("JSV v3 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
