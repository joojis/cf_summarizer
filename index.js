'use strict';

var async = require('async');
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

var captureProblem = function (url, filepath, cb) {
	captureElement(url, selectors.problemStatement, filepath, cb);
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
	console.log('retrieveProblems: ', urls);
	async.series(urls.map(function (url) {
		var problemLetter = url.split('/').reverse()[0];
		return function (cb) {
			console.log('captureProblem', problemLetter, url);
			captureProblem(url, '758' + problemLetter + '.png', function (err) {
				console.log('captureProblem', problemLetter, 'done');
				cb(err);
			});
		}
	}), function (err, results) {
		if (err) {
			console.error(err)
		} else {
			console.log('done');
		}
		phantom.exit();
	});
});
