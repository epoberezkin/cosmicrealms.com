"use strict";

var base = require("xbase"),
	generate = require("./generate.js"),
	emailValidator = require("email-validator");

generate.valid(50000).forEach(function(valid)
{
	valid.emailAddresses.forEach(function(email)
	{
		var result = emailValidator.validate(email);
		if(!result)
			base.error("Invalid %s [%s]", result, email);
	});
});