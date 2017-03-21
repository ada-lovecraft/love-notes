const unified = require('unified')
const remark = require('remark')
const lovenotes = require('./remark-lovenotes')
const jetpack = require('fs-jetpack')
const debug = require('debug')
const fmt = require('fmt-obj')
const CodeStore = require('./CodeStore')

const fs = jetpack

const log = debug('App:log')
const err = debug('App:err')

const olog = o => {
  console.log(fmt(o))
}

const contents = fs.read('./test/test.md')
const store = new CodeStore()
