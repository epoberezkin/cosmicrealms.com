"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	zschema = new (require("z-schema"))({sync : true}),
	assert = require("assert");

var schema = zschema.compileSchema(test_schema.schema4);
var valid = test_object.valid;
var invalid = test_object.invalid;

assert.strictEqual(zschema.validate(invalid, schema), false);

// z-schema doesn't support several valid e-mails, so remove those first
valid.emailAddresses.splice(2, 1);
valid.emailAddresses.splice(4, 5);
valid.emailAddresses.splice(14, 1);

assert.strictEqual(zschema.validate(valid, schema), true);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	zschema.validate(valid, schema);
}
end = Date.now();

console.log("z-schema v4 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));
