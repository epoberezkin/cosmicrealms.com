"use strict";

var base = require("xbase"),
	fs = require("fs"),
	path = require("path"),
	Rand48 = require("rand48").Rand48;

var r = new Rand48(47474);		// Seeded, so this file ALWAYS produces the same exact data
var o, z, numItems;
var invalidEmailLetters = [].pushSequence(32, 47).pushSequence(58, 64).pushSequence(91, 96).pushSequence(123, 126).map(function(charCode) { return String.fromCharCode(charCode); });

exports.valid = valid;
function valid(howMany)
{
	var out=[];
	[].pushSequence(1, howMany).forEach(function(i)
	{
		o = {};
		["fullName", "state", "city"].forEach(function(key) { o[key] = randLetters(); });
		o["favoriteFiveLetterWord"] = randLetters(5);
		
		o["emailAddresses"] = [];
		numItems = r.rand(3, 50);
		for(z=0;z<numItems;z++)
		{
			o["emailAddresses"].push(randLetters(r.rand(5, 40), invalidEmailLetters) + "@" + randLetters(r.rand(5, 13), invalidEmailLetters) + "." + ["org", "net", "com", "gov", "edu", "rw", "uk"][r.rand(0, 6)]);
		}

		o["dozen"] = 12;
		o["dozenOrBakersDozen"] = [12, 13][r.rand(0, 1)];

		o["favoriteEvenNumber"] = r.rand(2, 2000000000);
		if(o["favoriteEvenNumber"]%2!==0)
			o["favoriteEvenNumber"]++;

		o["married"] = [true, false][r.rand(0, 1)];
		o["age"] = r.rand(1, 110);
		o["zip"] = ("" + r.rand(0, 99999));
		while(o["zip"].length<5)
		{
			o["zip"] = "0" + o["zip"];
		}
		o["zip"] = +o["zip"];

		o["topThreeFavoriteColors"] = [];
		for(z=0;z<3;z++)
		{
			var colors = ["red", "green", "blue", "orange", "black", "white", "yellow"];
			while(o["topThreeFavoriteColors"].length<3)
			{
				o["topThreeFavoriteColors"].push(colors.splice(r.rand(0, colors.length-1), 1)[0]);
			}
		}

		o["favoriteSingleDigitWholeNumbers"] = [];
		numItems = r.rand(1, 10);
		var wholeNumbers = [].pushSequence(0, 9);
		while(o["favoriteSingleDigitWholeNumbers"].length<numItems)
		{
			o["favoriteSingleDigitWholeNumbers"].push(wholeNumbers.splice(r.rand(0, wholeNumbers.length-1), 1)[0]);
		}

		o["ipAddresses"] = [];
		numItems = r.rand(3, 50);
		for(z=0;z<numItems;z++)
		{
			o["ipAddresses"].push(r.rand(1, 255) + "." + r.rand(0, 255) + "." + r.rand(0, 255) + "." + r.rand(0, 255));
		}

		out.push(o);
	});
	return out;
}

/*
Uppercase and lowercase English letters (a-z, A-Z)
Digits 0 to 9
Characters ! # $ % & ' * + - / = ? ^ _ ` { | } ~
Character . (dot, period, full stop) provided that it is not the first or last character, and provided also that it does not appear two or more times consecutively.*/

exports.invalid = invalid;
function invalid(howMany)
{
	var out=[];
	[].pushSequence(1, howMany).forEach(function(i)
	{
		o = {};
		o["fullName"] = [null, false, undefined, true, 3791, 90912.2, -1294145][r.rand(0, 6)];
		o["age"] = [null, false, undefined, true, -1294145, randLetters()][r.rand(0, 5)];
		o["state"] = [null, false, undefined, true, 3791, 90912.2, -1294145][r.rand(0, 6)];
		o["city"] = [null, false, undefined, true, 3791, 90912.2, -1294145][r.rand(0, 6)];
		o["zip"] = [null];
		o["married"] = randLetters();
		o["dozen"] = [null, false, undefined, true, 3791, 90912.2, -1294145][r.rand(0, 6)];
		o["dozenOrBakersDozen"] = [null, false, undefined, true, 3791, 90912.2, -1294145, randLetters()][r.rand(0, 7)];
		o["favoriteEvenNumber"] = [null, false, undefined, true, 3791, 90913.3, -1294145, randLetters()][r.rand(0, 7)];
		o["emailAddresses"] = [];

		o["topThreeFavoriteColors"] = [];
		numItems = r.rand(1, 2);
		for(z=0;z<numItems;z++)
		{
			o["topThreeFavoriteColors"].push([null, false, undefined, true, 3791, 90912.2, -1294145][r.rand(0, 6)]);
		}

		o["favoriteSingleDigitWholeNumbers"] = [];
		numItems = r.rand(1, 20);
		for(z=0;z<numItems;z++)
		{
			o["topThreeFavoriteColors"].push(r.rand(0, 600)/r.rand(2, 500));
		}

		o["favoriteFiveLetterWord"] = randLetters(r.rand(6, 50));

		o["ipAddresses"] = [];
		numItems = r.rand(1, 13);
		for(z=0;z<numItems;z++)
		{
			o["ipAddresses"].push(r.rand(0, 300) + "." + r.rand(255, 500) + "." + r.rand(4, 400) + "." + r.rand(1, 900));
		}

		out.push(o);
	});
	return out;
}

function randLetters(length, illegalLetters)
{
	length = length || r.rand(5, 40);
	illegalLetters = illegalLetters || [];
	var result = "";
	var c;
	for(var i=0;i<length;i++)
	{
		do
		{
			c = String.fromCharCode(r.rand(32, 126));
		} while(illegalLetters.contains(c));
		
		result += c;
	}
	return result;
}
