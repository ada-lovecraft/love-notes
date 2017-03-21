'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = undefined;

var generate = exports.generate = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(fp) {
    var contents, markup, newfp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return read(fp);

          case 2:
            contents = _context.sent;
            _context.next = 5;
            return convert(contents);

          case 5:
            markup = _context.sent;
            newfp = filename(fp);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function generate(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.read = read;
exports.convert = convert;
exports.codeblocks = codeblocks;
exports.rename = rename;
exports.write = write;

var _unified = require('unified');

var _unified2 = _interopRequireDefault(_unified);

var _remark = require('remark');

var _remark2 = _interopRequireDefault(_remark);

var _remarkParse = require('remark-parse');

var _remarkParse2 = _interopRequireDefault(_remarkParse);

var _fsJetpack = require('fs-jetpack');

var _fsJetpack2 = _interopRequireDefault(_fsJetpack);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fmtObj = require('fmt-obj');

var _fmtObj2 = _interopRequireDefault(_fmtObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = _fsJetpack2.default;

var log = (0, _debug2.default)('LoveNotes:log');
var err = (0, _debug2.default)('LoveNotes:err');

function read(filename) {
  return new Promise(function (resolve, reject) {
    try {
      var contents = fs.read(filename);
      resolve(contents);
    } catch (e) {
      err(e);
      reject(e);
    }
  });
}

function convert(contents) {
  return new Promise(function (resolve, reject) {
    try {
      var ast = (0, _remark2.default)().parse(contents);
      resolve(ast);
    } catch (err) {
      reject(err);
    }
  });
}

function codeblocks(contents) {
  console.log('codeblocks:', contents);
  return new Promise(function (resolve, reject) {
    try {
      resolve(parse(contents));
    } catch (err) {
      reject(err);
    }
  });
}

function rename(fp) {
  return fp.match(/\/?(\S+)\..*$/)[1] + '.html';
}

function write(fp, html) {
  fs.write(fp, html);
}