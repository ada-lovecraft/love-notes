import test from 'ava'

import unified from 'unified'
import select from 'unist-util-select'
import jetpack from 'fs-jetpack'

import fmt from 'pretty-format'

import CodeStore from '../src/CodeStore'
import utils from './test-utils'

const {mocks} = utils
const fs = jetpack

var store

test.beforeEach(() => {
  store = new CodeStore()
})

test('CodeStore instantiates properly', t => {
  t.true(!!store.codefiles, 'codefile collection created')
  t.is(store.codefiles.length, 0, 'codefiles array contains no codefiles')
})



test('CodeStore#addCodeFile', t => {
  const f1 = store.addCodeFile()
  const f2 = store.addCodeFile('utils.js')

  t.is(store.codefiles.length, 2)
  t.is(store.codefiles[0].filename, 'index.js')
  t.is(store.codefiles[1].filename, 'utils.js')

  t.truthy(f1, 'returns the newly created CodeFile')
  t.is(f1.filename, 'index.js')

  t.truthy(f2,'returns the newly created CodeFile')
  t.is(f2.filename, 'utils.js')

  t.throws(() => store.addCodeFile('index.js'), ReferenceError, 'should error when duplicate filename found')
})

test('CodeStore#findCodeFileByName', t => {
  store.addCodeFile()
  store.addCodeFile('utils.js')

  var file = store.findCodeFileByName('index.js')
  t.truthy(file)
  t.is(file.filename, 'index.js')
  var file = store.findCodeFileByName('utils.js')
  t.truthy(file)
  t.is(file.filename, 'utils.js')
  t.falsy(store.findCodeFileByName('greet.js'))
})

test('CodeStore#parseLang', t => {
  var {filename, section} = store.parseLang()
  t.is(filename, 'index.js')
  t.is(section, 'default')

  var {filename, section} = store.parseLang('js > index.js')
  t.is(filename, 'index.js')
  t.is(section, 'default')

  var {filename, section} = store.parseLang('js > index.js#default')
  t.is(filename, 'index.js')
  t.is(section, 'default')

  var {filename, section} = store.parseLang('js > #greet')
  t.is(filename, 'index.js')
  t.is(section, '#greet')

  var {filename, section} = store.parseLang('js > index.js#greet')
  t.is(filename, 'index.js')
  t.is(section, '#greet')

  var {filename, section} = store.parseLang(' > math.js')
  t.is(filename, 'math.js')
  t.is(section, 'default')

  var {filename, section} = store.parseLang(' > math.js#sum-body')
  t.is(filename, 'math.js')
  t.is(section, '#sum-body')
})

test('CodeStore#addNode', t => {
  store.addCodeFile()
  const nodes = mocks.defaultIndex()
  store.addNode(nodes[0])
  store.addNode(nodes[1])
  t.is(store.codefiles[0].codesections.length, 2)
  const section = store.codefiles[0].findCodeSectionByName('default')
  const s2 = store.codefiles[0].findCodeSectionByName('#greet')
  t.is(section.children.length, 1)
})

test('CodeStore#generateSource single source file', t => {
  const nodes = mocks.defaultIndex()
  store.addNode(nodes[0])
  store.addNode(nodes[1])

  const file = store.findCodeFileByName('index.js')
  const src = store.generateSource('index.js')
  t.is(src.trim(), `// this is a code block\nfunction greet() {\n  console.log('hello, world!')\n}\n\ngreet()`)

})
