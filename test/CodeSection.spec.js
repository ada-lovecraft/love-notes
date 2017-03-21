import test from 'ava'

import unified from 'unified'
import select from 'unist-util-select'
import utils from './test-utils'
import CodeSection from '../src/CodeSection'

const {mocks} = utils
var section

test.beforeEach( t => {
  section = new CodeSection('root', 0)
})

test('CodeSection#constructor istantiates or throws correctly', t => {
  t.truthy(section.blocks, 'blocks collection created')
  t.truthy(section._source, 'source collection created')
  t.falsy(section._children, 'children collection is null')
  t.is(section.blocks.length, 0, 'blocks collection contains no code blocks')
  t.is(section.source.length, 0, 'source collection contains no code lines')

  t.throws(() => {new CodeSection(null)}, SyntaxError, 'no name provided')
})


test('CodeSection#addBlock adds MDAST code blocks', t => {
  section.addBlock(mocks.test()[0])
  t.is(section.blocks.length, 1)
  t.is(section._source.length, 1)
  t.is(section._children, null)
})
