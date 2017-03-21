import test from 'ava'
import select from 'unist-util-select'

import CodeFile from '../src/CodeFile'
import utils from './test-utils'

const {mocks} = utils


test('CodeFile throws if no filename given at instantiation', t => {
  t.throws(() => {new CodeFile()}, SyntaxError)
})

test('CodeFile#constructor', t => {
  const cf = new CodeFile('index.js')
  t.is(cf.filename, 'index.js')
  t.is(cf.codesections.length, 1)
  t.is(cf.codesections[0].name, 'default')
})

test('CodeFile#addCodeSection', t => {
  const cf = new CodeFile('index.js')
  const section = cf.addCodeSection('#greet')
  t.is(cf.codesections.length, 2)
  t.is(cf.codesections[1].name, '#greet')
  t.truthy(section, 'returns the newly created CodeSection')
  t.is(section.name, '#greet')
})

test('CodeFile#findCodeSectionByName', t => {
  const cf = new CodeFile('index.js')
  var section = cf.findCodeSectionByName('default')
  t.truthy(section)
  t.is(section.name, 'default')
  t.falsy(cf.findCodeSectionByName('#greet'))
})

test('CodeFile#addBlockContentsToCodeSection', t => {
  const cf = new CodeFile('index.js')
  const blocks = mocks.defaultIndex()

  t.notThrows(() => {cf.addBlockToCodeSection(blocks[0])})
  t.throws(() => {cf.addBlockToCodeSection(blocks[1])}, ReferenceError)

  cf.addCodeSection('#greet')
  t.notThrows(() => {cf.addBlockToCodeSection(blocks[1])})

  var s = cf.findCodeSectionByName('default')
  t.is(s.name, 'default')
  t.is(s.blocks.length, 1)
})
