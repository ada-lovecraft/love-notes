const debug = require('debug')
const {unless} = require('./utils')
const CodeSection = require('./CodeSection')

const log = debug('CodeFile:log')

class Node {
  constructor(name, source) {
    this.name = name
    this.source = source
    this.children = []
  }
}

class CodeFile {
  constructor(filename) {
    unless(filename, () => {throw new SyntaxError('CodeFile must be instantiated with a filename')})
    this.filename = filename
    this.codesections = []
    this._source = null
    this.addCodeSection('default')
    this.root = this.findCodeSectionByName('default')

  }

  get sectionNames() {
    return this.codesections.map(cs => cs.name)
  }

  addCodeSection(sectionName) {
    const section = new CodeSection(sectionName)
    this.codesections.push(section)
    this.sectionID++
    return section
  }

  findCodeSectionByName(sectionName) {
    return this.codesections.find(s => s.name === sectionName)
  }


  addBlockToCodeSection(block) {
    let section = this.findCodeSectionByName(block.data.section)
    unless(section, () => { section = this.addCodeSection(block.data.section)})
    section.addBlock(block)
  }

  buildDependencyTree(sectionName = 'default') {
    const section = this.findCodeSectionByName(sectionName)
    const tree = new Node(section.name, section.source)
    if(section.children) {
      tree.children = section.children.map(c => {
        return this.buildDependencyTree(c)
      })
    }
    return tree
  }
}

module.exports = CodeFile
