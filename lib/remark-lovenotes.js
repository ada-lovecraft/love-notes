'use strict';

var visit = require('unist-util-visit');
var debug = require('debug');

var log = debug('remark-lovenotes:log');

function lovenotes() {
  return function transformer(ast) {
    visit(ast, 'code', {});
  };
}

module.exports = lovenotes;