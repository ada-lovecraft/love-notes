const visit = require('unist-util-visit')
const debug = require('debug')

const log = debug('remark-lovenotes:log')


function lovenotes() {
  return function transformer(ast) {
    visit(ast, 'code', {
      
    })
  }
}

module.exports = lovenotes
