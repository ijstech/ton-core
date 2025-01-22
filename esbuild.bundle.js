// const dependencies = require('./package.json').dependencies || {}
// const packageName = require('./package.json').name

const Fs = require('fs')

async function readFile(fileName) {
  return new Promise((resolve, reject) => {
    Fs.readFile(fileName, 'utf8', function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

async function build() {
  let result = await require('esbuild')
    .build({
      entryPoints: ['src/index.ts'],
      outdir: 'lib',
      bundle: true,
      minify: true,
      format: 'cjs',
      // external: [...Object.keys(dependencies)],
      plugins: [],
      target: 'esnext',
      inject: ['./buffer-shim.js'],
    })
    .catch(() => process.exit(1));

  let content = await readFile('lib/index.js')
  content = `
define("@scom/ton-core", ["require", "exports"], function (require, exports) {
  Object.defineProperty(exports, "__esModule", { value: true }); 
  ${content}
});`

  Fs.writeFileSync('lib/bundle.js', content)
}
build()
