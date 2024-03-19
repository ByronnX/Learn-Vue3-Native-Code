// monorepo打包
const execa = require("execa");

// 进行打包，并行
async function build(target) {
    console.log('target',target,'333');
    
    // -c 执行rollup配置
    // --environment环境变量
    await execa("rollup", ["-cw", "--environment", `TARGET:${target}`],{stdio:'inherit'}); // 子进程的输出在父包中输出
}
build('reactivity')
