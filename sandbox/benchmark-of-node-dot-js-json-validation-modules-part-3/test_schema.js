"use strict";

exports.schema2 =
{
	name : "test",
	type : "object",
	additionalProperties : false,
	properties :
	{
		fullName                        : { type : "string" },
		age                             : { type : "integer", minimum : 0 },
		optionalItem                    : { type : "string", optional : true },
		state                           : { type : "string", optional : true },
		city                            : { type : "string", optional : true },
		zip                             : { type : "integer", format : "postal-code" },
		married                         : { type : "boolean" },
		dozen                           : { type : "integer", minimum : 12, maximum : 12 },
		dozenOrBakersDozen              : { type : "integer", minimum : 12, maximum : 13 },
		favoriteEvenNumber              : { type : "integer", divisibleBy : 2 },
		topThreeFavoriteColors          : { type : "array", minItems : 3, maxItems : 3, uniqueItems : true, items : { type : "string", format : "color" }},
		favoriteSingleDigitWholeNumbers : { type : "array", minItems : 1, maxItems : 10, uniqueItems : true, items : { type : "integer", minimum : 0, maximum : 9 }},
		favoriteFiveLetterWord          : { type : "string", minLength : 5, maxLength : 5 },
		emailAddresses                  : { type : "array", minItems : 1, uniqueItems : true, items : { type : "string", format : "email" }},
		ipAddresses                     : { type : "array", uniqueItems : true, items : { type : "string", format : "ip-address" }},
	}
};

exports.schema3 =
{
	name : "test",
	type : "object",
	additionalProperties : false,
	properties :
	{
		fullName                        : { type : "string", required : true },
		age                             : { type : "integer", required : true, minimum : 0 },
		optionalItem                    : { type : "string" },
		state                           : { type : "string" },
		city                            : { type : "string" },
		zip                             : { type : "integer", required : true, minimum : 0, maximum : 99999 },
		married                         : { type : "boolean", required : true },
		dozen                           : { type : "integer", required : true, minimum : 12, maximum : 12 },
		dozenOrBakersDozen              : { type : "integer", required : true, minimum : 12, maximum : 13 },
		favoriteEvenNumber              : { type : "integer", required : true, divisibleBy : 2 },
		topThreeFavoriteColors          : { type : "array", required : true, minItems : 3, maxItems : 3, uniqueItems : true, items : { type : "string", format : "color" }},
		favoriteSingleDigitWholeNumbers : { type : "array", required : true, minItems : 1, maxItems : 10, uniqueItems : true, items : { type : "integer", minimum : 0, maximum : 9 }},
		favoriteFiveLetterWord          : { type : "string", required : true, minLength : 5, maxLength : 5 },
		emailAddresses                  : { type : "array", required : true, minItems : 1, uniqueItems : true, items : { type : "string", format : "email" }},
		ipAddresses                     : { type : "array", required : true, uniqueItems : true, items : { type : "string", format : "ip-address" }},
	}
};

exports.schema4 =
{
	name : "test",
	type : "object",
	additionalProperties : false,
	required : ["fullName", "age", "zip", "married", "dozen", "dozenOrBakersDozen", "favoriteEvenNumber", "topThreeFavoriteColors", "favoriteSingleDigitWholeNumbers", "favoriteFiveLetterWord", "emailAddresses", "ipAddresses"],
	properties :
	{
		fullName                        : { type : "string" },
		age                             : { type : "integer", minimum : 0 },
		optionalItem                    : { type : "string" },
		state                           : { type : "string" },
		city                            : { type : "string" },
		zip                             : { type : "integer", minimum : 0, maximum : 99999 },
		married                         : { type : "boolean" },
		dozen                           : { type : "integer", minimum : 12, maximum : 12 },
		dozenOrBakersDozen              : { type : "integer", minimum : 12, maximum : 13 },
		favoriteEvenNumber              : { type : "integer", multipleOf : 2 },
		topThreeFavoriteColors          : { type : "array", minItems : 3, maxItems : 3, items : { type : "string" }},
		favoriteSingleDigitWholeNumbers : { type : "array", minItems : 1, maxItems : 10, items : { type : "integer", minimum : 0, maximum : 9 }},
		favoriteFiveLetterWord          : { type : "string", minLength : 5, maxLength : 5 },
		emailAddresses                  : { type : "array", minItems : 1, items : { type : "string", format : "email" }},
		ipAddresses                     : { type : "array", items : { type : "string", format : "ipv4" }},
	}
};
