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
      format: 'iife',
      // external: [...Object.keys(dependencies)],
      globalName: 'TonCore',
      plugins: [],
      target: 'esnext',
      define: {
        global: 'window'
      },
      inject: ['./buffer-shim.js'],
    })
    .catch(() => process.exit(1));

  let content = await readFile('lib/index.js')
  content = `
define("@scom/ton-core", ["require", "exports"], function (require, exports) {
  Object.defineProperty(exports, "__esModule", { value: true }); 
  ${content}
  if (typeof module !== "undefined" && module.exports) { module.exports = TonCore; } 
    // exports.default = TonCore;
    Object.assign(exports, TonCore)
});`
  Fs.writeFileSync('lib/index.js', content)
}
build()
