import remark from 'remark'
import html from 'remark-html'
import visit from 'unist-util-visit'
import u from 'unist-builder'
import jetpack from 'fs-jetpack'
import debug from 'debug'
import fmt from 'fmt-obj'
import {truncValues, none} from './utils'
import reporter from 'vfile-reporter'
import CodeStore from './CodeStore'
import LoveNotes from './LoveNotes'


const fs = jetpack

const log = debug('love-notes:log')
const err = debug('love-notes:err')


function process(fptr) {
  log('fptr:', fptr)

  const contents = fs.read(fptr)
  const store = new CodeStore()
  const ast = remark().parse(contents)

  visit(ast, 'code', node => {
    node.data = node.data || {}
    if(none(node.data.process) || !!node.data.process) {
      // that's some bad ~hat~ side-effect, harry :\
      node = store.addNode(node)
    }
  })
  log('virtual files created:', store.codefiles.length)
  return store
}

function tangle(fptr, outdir = './docs') {
  log('outdir:', outdir)
  const store = process(fptr)

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

function weave(fptr, outdir = `./docs`, optr) {

  const contents = fs.read(fptr)
  const filename = optr || /\/?(\S+)\.\S+$/.exec(fptr)[1] + '.html'
  remark().use(weaver).use(html).process(contents, function (err, file) {
    const pen = fs.cwd(outdir)
    pen.write(filename, file.contents)
    log(`created file ${pen.cwd()}/${filename}`)
  });
}

function weaver() {

  function transformer(ast, file) {
    var insertions = []

    visit(ast,'code', (node, index, parent) => {
      const {lang} = node
      const data = node.data || {}
      const cmdstr = lang.split(' ')
      if(cmdstr.length >= 2 && cmdstr[1] === '<3') {
        node.lang = cmdstr[0]
        data.process = false
        let htmlsrc = node.value
        if(node.lang === 'js') {
          htmlsrc = `<script>\n${node.value}\n</script>`
        }
        const htmlNode = u('html', {value: htmlsrc})
        insertions.push({node, index, parent, htmlNode})
      }
      node.data = data
    })
    insertions.forEach((insert, idx) => {
      insert.parent.children.splice(insert.index + (idx+1), 0, insert.htmlNode)
    })
  }

  return transformer
}

export default { tangle, process, weave }
