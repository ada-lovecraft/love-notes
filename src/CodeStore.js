const debug = require('debug')
const CodeFile = require('./CodeFile')
const {unless} = require('./utils')

const log = debug('CodeStore:log')



class CodeStore {

  constructor() {
    this.codefiles = []
  }

  get filenames() {
    return this.codefiles.map(file => filename)
  }
  addCodeFile(filename = 'index.js') {
    const file = new CodeFile(filename)
    if(this.findCodeFileByName(filename)) {
      throw new ReferenceError(`CodeStore already contails a file named ${filename}`)
    }
    this.codefiles.push(file)
    return file
  }

  findCodeFileByName(filename) {
    return this.codefiles.find(f => f.filename == filename)
  }

  modifyNodeData(node) {
    const data = node.data
    const lang = node.lang
    const {filename, section} = this.parseLang(lang)
    data.filename = filename
    data.section = section

    // find sections identified in this block
    const childSectionNames = this.listChildSectionNamesForNode(node)
    // append the childnames to the node's data
    data.childSections = childSectionNames
    node.data = data
    return node
  }



  addNode(node) {
    node = this.modifyNodeData(node)
    const {filename, section, childSections} = node.data
    let file = this.findCodeFileByName(filename)
    unless(file, () => { file = this.addCodeFile(filename)})

    const [default_, ...sectionNames] = file.sectionNames

    // create any new sections on this file that this node contain
    childSections
      .filter(section => !sectionNames.includes(section))
      .forEach(newSection => file.addCodeSection(newSection))


    try {
      file.addBlockToCodeSection(node, data.section)
    } catch(err) {
      if(err instanceof ReferenceError) {
        file.addCodeSection(section)
        file.addBlockToCodeSection(node, section)
      } else {
        throw err
      }
    }
  }

  listChildSectionNamesForNode(node) {
    const lines = node.value.split('\n')
    const sectionTag = /^#\S+$/
    return lines
    .map(line => line.trim())
    .reduce((sections, line) => {
      if(sectionTag.test(line)) {
        sections.push(line)
      }
      return sections
    }, [])
  }

  generateSource(filename = 'index.js') {
    const file = this.findCodeFileByName(filename)
    const tree = file.buildDependencyTree()
    return this.buildSourceFromNode(tree)
  }

  buildSourceFromNode(node) {
    let src = node.source
    while(node.children.length) {
      const child = node.children.pop()
      const csrc = this.buildSourceFromNode(child)
      src = src.replace(child.name,csrc)
    }
    return src
  }

  parseLang(lang) {

    let ret = {filename: 'index.js', section: 'default'}
    if(!lang) {
      return ret
    }

    const s = lang.split('>')
    if(!s.length) {
      return ret
    }

    const cmd = s[1].trim()

    const fileAndSection = /(\S+)(#\S+)$/
    const file = /^(\S+)$/
    const section = /^(#\S+)$/

    if(fileAndSection.test(cmd)) {

      const exc = fileAndSection.exec(cmd)
      ret.filename = exc[1]
      ret.section = exc[2]
      if(ret.section === '#default') {
        ret.section = 'default'
      }
      return ret
    }
    if(section.test(cmd)) {

      ret.section = section.exec(cmd)[1]
      return ret
    }

    if(file.test(cmd)) {
      ret.filename = file.exec(cmd)[1]
      return ret
    }

    return ret
  }


}

module.exports = CodeStore
