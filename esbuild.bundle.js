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
    .catch(() => process.exit(1))

  let content = await readFile('lib/index.js')
  content = `
define("@ijstech/ton-core", ["require", "exports"], function (require, exports) {
  Object.defineProperty(exports, "__esModule", { value: true }); 
  ${content}
});`

  Fs.writeFileSync('dist/index.js', content)

  let typesContent = await readFile('types/index.d.ts')

  const regex = /declare\smodule\s\"\@ton\/core\"\s\{\n(.*?)\n\}\n/gs
  let mainContent = ''
  while ((match = regex.exec(typesContent))) {
    mainContent += match[1]
  }

  typesContent = typesContent.replace('/// <reference types="node" />', '')

  typesContent = `${typesContent}
/// <amd-module name="@ijstech/ton-core" />
declare module "@ijstech/ton-core" {
  ${mainContent}
}
`

  Fs.writeFileSync('types/index.d.ts', typesContent)
}

build()
