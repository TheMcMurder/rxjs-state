import serve from 'rollup-plugin-serve'
import { resolve } from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { babel } from '@rollup/plugin-babel'

const supportedFormats = ['esm']
const distDir = resolve('./dist/')
const prodMode = !process.env.ROLLUP_WATCH
const mode = prodMode ? 'production' :'development'

const serveConfig = getServeConfig()


const config = {
  input: 'src/rxjs-state.js',
  output: {
    dir: distDir,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    mode !== 'production' && serve(serveConfig),
  ]
}

export default config


function getServeConfig() {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    contentBase: distDir,
  }
}