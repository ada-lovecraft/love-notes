const fmt = require('fmt-obj')
const debug = require('debug')
const {tangle} = require('../dist')

tangle('test/test.md', 'example-output')
