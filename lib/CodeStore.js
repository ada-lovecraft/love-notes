'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug');
var CodeFile = require('./CodeFile');

var _require = require('./utils'),
    unless = _require.unless;

var fmt = require('fmt-obj');
var log = debug('CodeStore:log');

var CodeStore = function () {
  function CodeStore() {
    _classCallCheck(this, CodeStore);

    this.codefiles = [];
  }

  _createClass(CodeStore, [{
    key: 'addCodeFile',
    value: function addCodeFile() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'index.js';

      var file = this.findCodeFileByName(filename);
      if (file) {
        throw new ReferenceError('CodeFile ' + filename + ' already exists');
      }
      file = new CodeFile(filename);
      this.codefiles.push(file);
      return file;
    }
  }, {
    key: 'findCodeFileByName',
    value: function findCodeFileByName(filename) {
      return this.codefiles.find(function (f) {
        return f.name == filename;
      });
    }
  }, {
    key: 'modifyNodeData',
    value: function modifyNodeData(node) {
      var data = node.data;
      var lang = node.lang;

      var _parseLang = this.parseLang(lang),
          filename = _parseLang.filename,
          section = _parseLang.section;

      data.filename = filename;
      data.section = section;
      // find sections identified in this block
      var childSectionNames = this.listChildSectionNamesForNode(node);
      // append the childnames to the node's data
      data.childSections = childSectionNames;
      node.data = data;
      return node;
    }
  }, {
    key: 'addNode',
    value: function addNode(node) {
      var _this = this;

      node = this.modifyNodeData(node);

      var _node$data = node.data,
          filename = _node$data.filename,
          section = _node$data.section,
          childSections = _node$data.childSections;

      var file = this.findCodeFileByName(filename);
      unless(file, function () {
        file = _this.addCodeFile(filename);
      });
      log('adding node to file:', filename, file.name);

      var _file$sectionNames = _toArray(file.sectionNames),
          default_ = _file$sectionNames[0],
          sectionNames = _file$sectionNames.slice(1);

      // create any new sections on this file that this node contain


      var filtered = childSections.filter(function (section) {
        return !sectionNames.includes(section);
      });
      filtered.forEach(function (newSection) {
        return file.addCodeSection(newSection);
      });
      file.addBlockToCodeSection(node, section);
      log('added node to file:', file.name);
      log('filenames:', this.filenames);
    }
  }, {
    key: 'listChildSectionNamesForNode',
    value: function listChildSectionNamesForNode(node) {
      var lines = node.value.split('\n');
      var sectionTag = /^#\S+$/;
      return lines.map(function (line) {
        return line.trim();
      }).reduce(function (sections, line) {
        if (sectionTag.test(line)) {
          sections.push(line);
        }
        return sections;
      }, []);
    }
  }, {
    key: 'generateSource',
    value: function generateSource() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'index.js';

      var file = this.findCodeFileByName(filename);
      var tree = file.buildDependencyTree();
      return this.buildSourceFromNode(tree);
    }
  }, {
    key: 'buildSourceFromNode',
    value: function buildSourceFromNode(node) {
      var src = node.source;
      while (node.children.length) {
        var child = node.children.pop();
        var csrc = this.buildSourceFromNode(child);
        src = src.replace(child.name, csrc);
      }
      return src;
    }
  }, {
    key: 'parseLang',
    value: function parseLang(lang) {

      var ret = { filename: 'index.js', section: 'default' };
      if (!lang) {
        return ret;
      }

      var s = lang.split('>');
      if (!s.length) {
        return ret;
      }

      var cmd = s[1].trim();

      var fileAndSection = /(\S+)(#\S+)$/;
      var file = /^(\S+)$/;
      var section = /^(#\S+)$/;

      if (fileAndSection.test(cmd)) {

        var exc = fileAndSection.exec(cmd);
        ret.filename = exc[1];
        ret.section = exc[2];
        if (ret.section === '#default') {
          ret.section = 'default';
        }
        return ret;
      }
      if (section.test(cmd)) {

        ret.section = section.exec(cmd)[1];
        return ret;
      }

      if (file.test(cmd)) {
        ret.filename = file.exec(cmd)[1];
        return ret;
      }

      return ret;
    }
  }, {
    key: 'filenames',
    get: function get() {
      return this.codefiles.map(function (file) {
        return file.name;
      });
    }
  }]);

  return CodeStore;
}();

module.exports = CodeStore;