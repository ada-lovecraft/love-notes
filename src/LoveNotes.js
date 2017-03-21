import unified from 'unified'
import remark from 'remark'
import markdown from 'remark-parse'
import jetpack from 'fs-jetpack'
import debug from 'debug'
import fmt from 'fmt-obj'
const fs = jetpack

const log = debug('LoveNotes:log')
const err = debug('LoveNotes:err')

export function read(filename) {
  return new Promise((resolve, reject) => {
    try {
      const contents = fs.read(filename)
      resolve(contents)
    } catch (e) {
      err(e)
      reject(e)
    }
  })
}

export function convert(contents) {
  return new Promise((resolve, reject) => {
    try {
      const ast = remark().parse(contents)
      resolve(ast)
    } catch(err) {
      reject(err)
    }
  })
}

export function codeblocks(contents) {
  console.log('codeblocks:', contents)
  return new Promise((resolve, reject) => {
    try {
      resolve(parse(contents))
    } catch(err) {
      reject(err)
    }
  })
}

export function rename(fp) {
  return fp.match(/\/?(\S+)\..*$/)[1] + '.html'
}

export function write(fp, html) {
  fs.write(fp, html)
}


export async function generate(fp) {
  const contents = await read(fp)
  const markup = await convert(contents)
  const newfp = filename(fp)
}
