import visit from 'unist-util-visit'
import debug from 'debug'

const log = debug('remark-lovenotes:log')


function lovenotes() {
  return function transformer(ast) {
    visit(ast, 'code', {
      
    })
  }
}

module.exports = lovenotes
