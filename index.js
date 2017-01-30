'use strict';

var async = require('async');
var fs = require('fs');
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
		page.evaluate(function (selector) {
			$(selector).parentsUntil('body').siblings().remove();
			$('#pageContent').removeClass('content-with-sidebar');
		}, selector);
		page.paperSize = {
			format: 'A4',
			orientation: 'portrait',
			margin: '2cm',
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

// FIXME: contestId can be obtained from URL.
var convertUrlToFilename = function (constestId, url) {
	var problemLetter = url.split('/').reverse()[0];
	return String(contestId) + problemLetter + '.pdf';
}

var captureProblemSet = function (contestId, cb) {
	retrieveProblems(contestId, function (err, urls) {
		async.series(urls.map(function (url) {
			return function (cb) {
				captureProblem(url, convertUrlToFilename(contestId, url), function (err) {
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
};

var convertPNGsToPDF = function (pngFilepaths, pdfFilepath) {
	var doc = new PDFDocument();
	doc.pipe(fs.createWriteStream(pdfFilepath));
	pngFilepaths.forEach(function (pngFilepath) {
		doc.image(pngFilepath, 0, 0);
	});
	doc.end();
};

captureElement("http://codeforces.com/contest/758/problem/C", selectors.problemStatement, '758C_test.pdf', function () {
	console.log('done!!!');
	phantom.exit();
});