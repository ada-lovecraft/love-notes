'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug');

var _require = require('./utils'),
    unless = _require.unless,
    truncValues = _require.truncValues;

var CodeSection = require('./CodeSection');

var log = debug('CodeFile:log');

var Node = function Node(name, source) {
  _classCallCheck(this, Node);

  this.name = name;
  this.source = source;
  this.children = [];
};

var CodeFile = function () {
  function CodeFile(filename) {
    _classCallCheck(this, CodeFile);

    unless(filename, function () {
      throw new SyntaxError('CodeFile must be instantiated with a filename');
    });
    log('creating new CodeFile:', filename);
    this.name = filename;
    this.codesections = [];
    this.addCodeSection('default');
    this.root = this.findCodeSectionByName('default');
  }

  _createClass(CodeFile, [{
    key: 'addCodeSection',
    value: function addCodeSection(sectionName) {
      var section = new CodeSection(sectionName);
      this.codesections.push(section);
      return section;
    }
  }, {
    key: 'findCodeSectionByName',
    value: function findCodeSectionByName(sectionName) {
      return this.codesections.find(function (s) {
        return s.name === sectionName;
      });
    }
  }, {
    key: 'addBlockToCodeSection',
    value: function addBlockToCodeSection(block) {
      var _this = this;

      var section = this.findCodeSectionByName(block.data.section);
      log;
      unless(section, function () {
        section = _this.addCodeSection(block.data.section);
      });
      section.addBlock(block);
    }
  }, {
    key: 'buildDependencyTree',
    value: function buildDependencyTree() {
      var _this2 = this;

      var sectionName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      var section = this.findCodeSectionByName(sectionName);
      var tree = new Node(section.name, section.source);
      if (section.children) {
        tree.children = section.children.map(function (c) {
          return _this2.buildDependencyTree(c);
        });
      }
      return tree;
    }
  }, {
    key: 'sectionNames',
    get: function get() {
      return this.codesections.map(function (cs) {
        return cs.name;
      });
    }
  }]);

  return CodeFile;
}();

module.exports = CodeFile;