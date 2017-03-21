import remark from 'remark'
import visit from 'unist-util-visit'
import jetpack from 'fs-jetpack'
import debug from 'debug'
import fmt from 'fmt-obj'
import {truncValues} from './utils'
import CodeStore from './CodeStore'

const fs = jetpack

const log = debug('love-notes:log')
const err = debug('love-notes:err')



function tangle(fptr, outdir = './docs') {
  log('fptr:', fptr)
  log('outdir:', outdir)
  const contents = fs.read(fptr)
  const store = new CodeStore()
  const ast = remark().parse(contents)

  visit(ast, 'code', node => {
    node.data = node.data || {}
    store.addNode(node)
  })

  log('files created:', store.codefiles.length)
  const filenames = store.filenames
  log('filenames: %O', filenames)
  const files = filenames.map(file => {
    return {source: store.generateSource(file), name: file}
  })
  log('files:\n%O', files)
  const pen = fs.cwd(outdir)
  files.forEach(file => {
    pen.write(file.name, file.source)
  })
  log('files created:\n%O', pen.list().map(f => `${pen.cwd()}/${f}`))
}

export default { tangle }
