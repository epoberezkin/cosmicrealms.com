"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	jayschema = new (require("jayschema"))(),
	assert = require("assert");

// No speed difference compared to pre-registering the schema
var schema = test_schema.schema4;
var valid = test_object.valid;
var invalid = test_object.invalid;

assert.notStrictEqual(jayschema.validate(invalid, schema).length, 0);

// jayschema doesn't support several valid e-mails, so remove those first
valid.emailAddresses.splice(5, 5);

assert.strictEqual(jayschema.validate(valid, schema).length, 0);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	jayschema.validate(valid, schema);
}
end = Date.now();

console.log("jayschema v4 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
