const remark = require('remark')
const visit = require('unist-util-visit')
const jetpack = require('fs-jetpack')
const fmt = require('pretty-format')

const fs = jetpack

const contents = fs.read('./test/test.md')

module.exports = {
  mocks: {
    test: function() {
      return remark().parse(contents)
    }
  }
}
