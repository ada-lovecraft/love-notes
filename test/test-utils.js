const remark = require('remark')
const visit = require('unist-util-visit')
const jetpack = require('fs-jetpack')
const fmt = require('pretty-format')

const fs = jetpack

const contents = fs.read('./test/test.md')

module.exports = {
  mocks: {
    test: function() {
      const ast = remark().parse(contents)
      const mock = []
      let c = 0
      visit(ast, 'code', node => {
        node.data = {}
        mock.push(node)
      })
      return mock

    }
  }
}
