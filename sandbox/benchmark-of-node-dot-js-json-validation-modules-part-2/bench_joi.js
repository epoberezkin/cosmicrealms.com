"use strict";

var test_object = require("./test_object"),
	test_schema = require("./test_schema"),
	Joi = require("joi"),
	assert = require("assert");

var schema =
{
	fullName : Joi.string().required(),
	age : Joi.number().required().min(0),
	optionalItem : Joi.string(),
	state : Joi.string(),
	city : Joi.string(),
	zip : Joi.number().required().min(0).max(99999),
	married : Joi.boolean().required(),
	dozen : Joi.number().required().min(12).max(12),
	dozenOrBakersDozen : Joi.number().required().min(12).max(13),
	favoriteEvenNumber : Joi.number().required(),
	topThreeFavoriteColors : Joi.array().length(3).includes(Joi.string()),
	favoriteSingleDigitWholeNumbers : Joi.array().min(1).max(10).includes(Joi.number().min(0).max(9)),
	favoriteFiveLetterWord : Joi.string().required().length(5),
	emailAddresses : Joi.array().required().min(1).includes(Joi.string().email()),
	ipAddresses : Joi.array().required().includes(Joi.string().regex(/^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/))
};

var valid = test_object.valid;
var invalid = test_object.invalid;

// joi doesn't support several valid e-mails, so remove those first
valid.emailAddresses.splice(5, 5);

assert.notStrictEqual(Joi.validate(invalid, schema), null);
assert.strictEqual(Joi.validate(valid, schema), null);

var i=0, max=20000, start, end;

start = Date.now();
for(i=0;i<max;i++)
{
	Joi.validate(valid, schema);
}
end = Date.now();

console.log("joi v3 total time (" + (end-start) + ") and per document time: " + ((end-start)/max));

