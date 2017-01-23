'use strict';

var page = require('webpage').create();
var url = 'http://codeforces.com/contest/758/problem/D';
var outputFilename = '758D.png';

page.onLoadStarted = function () {
  console.log('onLoadStarted');
};
page.onLoadFinished = function () {
  console.log('onLoadFinished');
};
page.viewportSize = {
  width: 1920,
  height: 1080,
};
page.open(url, function (status) {
  if (status !== 'success') {
    console.error('Failed to load url: ', url);
    return;
  }
  console.log('Timeout start');
  window.setTimeout(function () {
    var clipRect = page.evaluate(function () {
      var targetElement = document.getElementsByClassName('problem-statement')[0];
      return targetElement.getBoundingClientRect();
    });
    page.clipRect = {
      top: clipRect.top,
      left: clipRect.left,
      width: clipRect.width,
      height: clipRect.height,
    };
    console.log('render start');
    page.render('test.png');
    page.render('test.pdf');
    console.log('render end');
    phantom.exit();
  }, 1000);
});
