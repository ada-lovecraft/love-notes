'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug');

var _require = require('./utils'),
    unless = _require.unless;

var log = debug('CodeSection:log');

var CodeSection = function () {
  function CodeSection(name) {
    _classCallCheck(this, CodeSection);

    unless(name, function () {
      throw new SyntaxError('CodeSection must be instantiated with a name');
    });
    this.name = name;
    this.blocks = [];
    this._children = null;
    this._source = [];
  }

  _createClass(CodeSection, [{
    key: 'addBlock',
    value: function addBlock(block) {
      this.blocks.push(block);
      this._source.push(block.value);
      if (block.data.childSections) {
        if (this._children) {
          this._children = this._children.concat(block.data.childSections);
        } else {
          this._children = block.data.childSections;
        }
      }
    }
  }, {
    key: 'source',
    get: function get() {
      return this._source.join('\n');
    }
  }, {
    key: 'children',
    get: function get() {
      return this._children;
    }
  }]);

  return CodeSection;
}();

module.exports = CodeSection;