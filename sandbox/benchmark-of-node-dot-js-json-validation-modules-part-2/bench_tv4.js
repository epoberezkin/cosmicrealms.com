"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	tv4 = require("tv4"),
	assert = require("assert");

var schema = test_schema.schema4;
var valid = test_object.valid;
var invalid = test_object.invalid;

assert.strictEqual(tv4.validate(invalid, schema), false);
assert.strictEqual(tv4.validate(valid, schema), true);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	tv4.validate(valid, schema);
}
end = Date.now();

console.log("tv4 v4 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
