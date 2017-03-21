const debug = require('debug')
const {unless} = require('./utils')
const log = debug('CodeSection:log')


class CodeSection {
  constructor(name) {
    unless(name, () => { throw new SyntaxError('CodeSection must be instantiated with a name')})
    this.name = name
    this.blocks = []
    this._children = null
    this._source = []
  }
  get source() {
    return this._source.join('\n')
  }
  get children() {
    return this._children
  }
  addBlock(block) {
    this.blocks.push(block)
    this._source.push(block.value)
    if(block.data.childSections) {
      if(this._children) {
        this._children = this._children.concat(block.data.childSections)
      } else {
        this._children = block.data.childSections
      }
    }

  }
}

module.exports = CodeSection
