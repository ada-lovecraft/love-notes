(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('remark'), require('remark-html'), require('unist-util-visit'), require('unist-builder'), require('fs-jetpack'), require('debug'), require('fmt-obj'), require('vfile-reporter')) :
	typeof define === 'function' && define.amd ? define(['remark', 'remark-html', 'unist-util-visit', 'unist-builder', 'fs-jetpack', 'debug', 'fmt-obj', 'vfile-reporter'], factory) :
	(global['love-notes-tangle'] = factory(global.remark,global.html,global.visit,global.u,global.jetpack,global.debug,global.fmtObj,global.vfileReporter));
}(this, (function (remark,html,visit,u,jetpack,debug,fmtObj,vfileReporter) { 'use strict';

remark = 'default' in remark ? remark['default'] : remark;
html = 'default' in html ? html['default'] : html;
visit = 'default' in visit ? visit['default'] : visit;
u = 'default' in u ? u['default'] : u;
jetpack = 'default' in jetpack ? jetpack['default'] : jetpack;
debug = 'default' in debug ? debug['default'] : debug;
fmtObj = 'default' in fmtObj ? fmtObj['default'] : fmtObj;
vfileReporter = 'default' in vfileReporter ? vfileReporter['default'] : vfileReporter;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







































var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

function none(obj) {
  return obj === null || obj === undefined || isNaN(obj) && obj === false;
}



function unless(exp, cb) {
  if (none(exp)) {
    cb();
  }
}

var log$3 = debug('CodeSection:log');

var CodeSection = function () {
  function CodeSection(name) {
    classCallCheck(this, CodeSection);

    unless(name, function () {
      throw new SyntaxError('CodeSection must be instantiated with a name');
    });
    this.name = name;
    this.blocks = [];
    this._children = null;
    this._source = [];
  }

  createClass(CodeSection, [{
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
    get: function get$$1() {
      return this._source.join('\n');
    }
  }, {
    key: 'children',
    get: function get$$1() {
      return this._children;
    }
  }]);
  return CodeSection;
}();

var log$2 = debug('CodeFile:log');

var Node = function Node(name, source) {
  classCallCheck(this, Node);

  this.name = name;
  this.source = source;
  this.children = [];
};

var CodeFile = function () {
  function CodeFile(filename) {
    classCallCheck(this, CodeFile);

    unless(filename, function () {
      throw new SyntaxError('CodeFile must be instantiated with a filename');
    });
    log$2('creating new CodeFile:', filename);
    this.name = filename;
    this.codesections = [];
    this.addCodeSection('root');
    this.root = this.findCodeSectionByName('root');
  }

  createClass(CodeFile, [{
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
      log$2;
      unless(section, function () {
        section = _this.addCodeSection(block.data.section);
      });
      section.addBlock(block);
    }
  }, {
    key: 'buildDependencyTree',
    value: function buildDependencyTree() {
      var _this2 = this;

      var sectionName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'root';

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
    get: function get$$1() {
      return this.codesections.map(function (cs) {
        return cs.name;
      });
    }
  }]);
  return CodeFile;
}();

var log$1 = debug('CodeStore:log');

var CodeStore = function () {
  function CodeStore() {
    classCallCheck(this, CodeStore);

    this.codefiles = [];
  }

  createClass(CodeStore, [{
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

      var _ref = !!data.filename ? data : this.parseLang(lang),
          filename = _ref.filename,
          section = _ref.section;

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
      log$1('adding node to file:', filename, file.name);

      var _file$sectionNames = toArray(file.sectionNames),
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
      log$1('added node to file:', file.name);
      log$1('filenames:', this.filenames);
      return node;
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

      var ret = { filename: 'index.js', section: 'root' };
      if (!lang) {
        return ret;
      }

      var s = lang.split('>');
      if (s.length < 2) {
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
          ret.section = 'root';
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
    get: function get$$1() {
      return this.codefiles.map(function (file) {
        return file.name;
      });
    }
  }]);
  return CodeStore;
}();

var fs = jetpack;

var log = debug('love-notes:log');
var err$1 = debug('love-notes:err');

function process(fptr) {
  log('fptr:', fptr);

  var contents = fs.read(fptr);
  var store = new CodeStore();
  var ast = remark().parse(contents);

  visit(ast, 'code', function (node) {
    node.data = node.data || {};
    if (none(node.data.process) || !!node.data.process) {
      // that's some bad ~hat~ side-effect, harry :\
      node = store.addNode(node);
    }
  });
  log('virtual files created:', store.codefiles.length);
  return store;
}

function create(files, outdir) {
  log('files:\n%O', files);
  var pen = fs.cwd(outdir);
  files.forEach(function (file) {
    pen.write(file.name, file.source);
  });
  log('files created:\n%O', pen.list().map(function (f) {
    return pen.cwd() + '/' + f;
  }));
}

function tangle(fptr) {
  var outdir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './docs';

  log('outdir:', outdir);
  var store = process(fptr);

  var filenames = store.filenames;
  log('filenames: %O', filenames);
  var files = filenames.map(function (file) {
    return { source: store.generateSource(file), name: file };
  });
  create(files, outdir);
  return files;
}

function weave(fptr) {
  var outdir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './docs';
  var optr = arguments[2];


  var contents = fs.read(fptr);
  var filename = optr || /\/?(\S+)\.\S+$/.exec(fptr)[1] + '.html';
  remark().use(weaver).use(html).process(contents, function (err, file) {
    var pen = fs.cwd(outdir);
    pen.write(filename, file.contents);
    log('created file ' + pen.cwd() + '/' + filename);
  });
}

function weaver() {

  function transformer(ast, file) {
    var insertions = [];

    visit(ast, 'code', function (node, index, parent) {
      var lang = node.lang;

      var data = node.data || {};
      var cmdstr = lang.split(' ');
      if (cmdstr.length >= 2 && cmdstr[1] === '<3') {
        node.lang = cmdstr[0];
        data.process = false;
        var htmlsrc = node.value;
        if (node.lang === 'js') {
          htmlsrc = '<script>\n' + node.value + '\n</script>';
        }
        var htmlNode = u('html', { value: htmlsrc });
        insertions.push({ node: node, index: index, parent: parent, htmlNode: htmlNode });
      }
      node.data = data;
    });
    insertions.forEach(function (insert, idx) {
      insert.parent.children.splice(insert.index + (idx + 1), 0, insert.htmlNode);
    });
  }

  return transformer;
}

var index = { tangle: tangle, process: process, weave: weave, create: create };

return index;

})));
//# sourceMappingURL=index.js.map
