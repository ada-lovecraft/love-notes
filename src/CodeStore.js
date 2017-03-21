import debug from 'debug'
import CodeFile from './CodeFile'
import {unless} from './utils'
import fmt from 'fmt-obj'
const log = debug('CodeStore:log')



class CodeStore {

  constructor() {
    this.codefiles = []
  }

  get filenames() {
    return this.codefiles.map(file => file.name)
  }
  addCodeFile(filename = 'index.js') {
    var file = this.findCodeFileByName(filename)
    if(file) {
      throw new ReferenceError(`CodeFile ${filename} already exists`)
    }
    file = new CodeFile(filename)
    this.codefiles.push(file)
    return file
  }

  findCodeFileByName(filename) {
    return this.codefiles.find(f => f.name == filename)
  }

  modifyNodeData(node) {
    const data = node.data
    const lang = node.lang
    let {filename, section} = !!data.filename ? data : this.parseLang(lang)
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

    var {filename, section, childSections} = node.data
    var file = this.findCodeFileByName(filename)
    unless(file, () => { file = this.addCodeFile(filename)})
    log('adding node to file:', filename, file.name)

    const [default_, ...sectionNames] = file.sectionNames

    // create any new sections on this file that this node contain
    var filtered = childSections
      .filter(section => !sectionNames.includes(section))
    filtered.forEach(newSection => file.addCodeSection(newSection))
    file.addBlockToCodeSection(node, section)
    log('added node to file:', file.name)
    log('filenames:', this.filenames)
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

    let ret = {filename: 'index.js', section: 'root'}
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
        ret.section = 'root'
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

export default CodeStore
