'use strict';

var webpage = require('webpage');

var selectors = {
	problemStatement: '.problem-statement',
	problemList: '.problems .left a',
};

var captureElement = function (url, selector, filepath, cb) {
	var page = webpage.create();
	page.open(url, function (status) {
		if (status !== 'success') {
			cb('Failed to load URL: ' + url);
			return;
		}
		var elementRect = page.evaluate(function (selector) {
			return document.querySelector(selector).getBoundingClientRect();
		}, selector);
		page.clipRect = {
			left: elementRect.left,
			top: elementRect.top,
			width: elementRect.width,
			height: elementRect.height,
		};
		page.render(filepath);
		cb(null);
	});
};

var retrieveProblems = function (contestId, cb) {
	var page = webpage.create();
	var url = 'http://codeforces.com/contest/' + contestId;
	page.open(url, function (status) {
		if (status !== 'success') {
			cb('Failed to load URL: ' + url);
			return;
		}
		var problemUrls = page.evaluate(function (selector) {
			return [].map.call(document.querySelectorAll(selector), function (anchorElem) {
				return anchorElem.href;
			});
		}, selectors.problemList);
		cb(null, problemUrls.sort());
	});
};

retrieveProblems(758, function (err, urls) {
	for (var i in urls) {
		console.log(urls[i]);
	}
	phantom.exit();
});

/*
captureElement('http://codeforces.com/contest/758/problem/D', selectors.problemStatement, 'kkk.png', function () {
	phantom.exit();
	console.log('done');
});
*/
