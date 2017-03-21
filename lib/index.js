'use strict';

require('babel-polyfill');
var unified = require('unified');
var remark = require('remark');
var visit = require('unist-util-visit');
var jetpack = require('fs-jetpack');
var debug = require('debug');
var fmt = require('fmt-obj');

var _require = require('./utils'),
    truncValues = _require.truncValues;

var CodeStore = require('./CodeStore');

var fs = jetpack;

var log = debug('love-notes:log');
var err = debug('love-notes:err');

function tangle(fptr) {
  var outdir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './docs';

  log('fptr:', fptr);
  log('outdir:', outdir);
  var contents = fs.read(fptr);
  var store = new CodeStore();
  var ast = remark().parse(contents);

  visit(ast, 'code', function (node) {
    node.data = node.data || {};
    store.addNode(node);
  });

  log('files created:', store.codefiles.length);
  var filenames = store.filenames;
  log('filenames: %O', filenames);
  var files = filenames.map(function (file) {
    return { source: store.generateSource(file), name: file };
  });
  log('files:\n%O', files);
  var pen = fs.cwd(outdir);
  files.forEach(function (file) {
    pen.write(file.name, file.source);
  });
  log('files created:\n%O', pen.list().map(function (f) {
    return pen.cwd() + '/' + f;
  }));
}

module.exports = { tangle: tangle };