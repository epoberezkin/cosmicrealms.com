"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	jsonGate = require("json-gate"),
	assert = require("assert");

var schema = jsonGate.createSchema(test_schema.schema3);
var valid = test_object.valid;
var invalid = test_object.invalid;

var invalidHasError = false;
try
{
	schema.validate(invalid);
}
catch(err)
{
	invalidHasError = true;
}
assert.strictEqual(invalidHasError, true);

// json-gate doesn't support several valid e-mails, so remove those first
valid.emailAddresses.splice(2, 2);
valid.emailAddresses.splice(3, 5);
valid.emailAddresses.splice(8, 2);
valid.emailAddresses.splice(11, 1);

schema.validate(valid);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	schema.validate(valid);
}
end = Date.now();

console.log("json-gate v3 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
