# 下载ts 
yarn add typescript -W -D
# 生成ts
npx tsc --init
# 安装rollup打包的相关依赖
yarn add rollup@2.56.3 rollup-plugin-typescript2@0.30.0 @rollup/plugin-node-resolve@13.0.4 @rollup/plugin-json@4.1.0 execa@5.1.1 typescript@4.4.2 -D -W

# 解释
"devDependencies": {
    "@rollup/plugin-json": "^6.1.0", // 用来解析json文件
    "@rollup/plugin-node-resolve": "^15.2.3", // 用来解析第三方插件
    "execa": "^8.0.1", // 用来处理子继承的
    "rollup": "^4.13.0", 
    "rollup-plugin-typescript2": "^0.36.0",
    "typescript": "^5.4.2"
  }