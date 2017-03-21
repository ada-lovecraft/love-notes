const {tangle, weave} = require('../dist')

tangle('test/readme-example.md', 'docs/')
weave('test/readme-example.md', 'docs/', 'index.html')
