const debug = require('debug')
const {unless, truncValues} = require('./utils')
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
    log('creating new CodeFile:', filename)
    this.name = filename
    this.codesections = []
    this.addCodeSection('default')
    this.root = this.findCodeSectionByName('default')

  }

  get sectionNames() {
    return this.codesections.map(cs => cs.name)
  }

  addCodeSection(sectionName) {
    const section = new CodeSection(sectionName)
    this.codesections.push(section)
    return section
  }

  findCodeSectionByName(sectionName) {
    return this.codesections.find(s => s.name === sectionName)
  }


  addBlockToCodeSection(block) {
    var section = this.findCodeSectionByName(block.data.section)
    log
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
