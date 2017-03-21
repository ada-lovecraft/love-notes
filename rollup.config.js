import babel from 'rollup-plugin-babel'
import includePaths from 'rollup-plugin-includepaths'

const includePathOptions = {
  paths: ['src'],
  extensions: ['.js']
}

const pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

export default {
  entry: 'src/index.js',
  plugins:[
    includePaths(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
          ["latest", {
            "es2015": {
              "modules": false
            }
          }]
        ],
      plugins: ["external-helpers"]
    })
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'love-notes-tangle',
      sourceMap: true
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es',
      sourceMap: true
    }
  ]

}
