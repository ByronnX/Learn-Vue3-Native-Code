import ts from 'rollup-plugin-typescript2' // 解析ts
import json from '@rollup/plugin-json' // 解析json
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方插件
import path from 'path' // 处理路径

// 2. 获取文件路径
let packagesDir = path.resolve(__dirname, 'packages')

// 2.1 获取需要打包的包
let packageDir = path.resolve(packagesDir, process.env.TARGET)
// 2.2 打包获取到每个包的项目配置
let resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve('package.json')) // 读取json
const packageOptions = pkg.buildOptions || {} // 获取json的配置项
const name = path.basename(packageDir)

// 3. 创建一个映射表
const outputOptions = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  "cjs": {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  "global": {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
};
const options = pkg.buildOptions
// rollup打包需要导出一个配置
function createConfig(format, output) {
    output.name = options.name
    output.sourcemap = true
    // 生成rollup配置
    return {
        input: resolve('src/index.ts'), // 导入
        output,
        plugins: [
            json(),
            ts({
                tsconfig:path.resolve(__dirname,"tsconfig.json")
            }),
            resolvePlugin()
        ]
    }
}
export default options.formats.map(format=>createConfig(format,outputOptions[format]))