import debug from 'debug'
import {unless, truncValues} from './utils'
import CodeSection from './CodeSection'

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
    this.addCodeSection('root')
    this.root = this.findCodeSectionByName('root')

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

  buildDependencyTree(sectionName = 'root') {
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

export default CodeFile
