// monorepo打包
const fs = require("fs");
const execa = require("execa");
// 拿到文件目录，同步
const dirs = fs.readdirSync("packages").filter((pre) => {
  // 文件夹才需要打包,过滤掉不是目录的文件
  if (!fs.statSync(`packages/${pre}`).isDirectory()) {
    return false;
  }
  return true;
});
// 进行打包，并行
async function build(target) {
    console.log('target',target,'333');
    
    // -c 执行rollup配置
    // --environment环境变量
    await execa("rollup", ["-c", "--environment", `TARGET:${target}`],{stdio:'inherit'}); // 子进程的输出在父包中输出
}
async function runParaller(dirs,itemfn) { 
    // 遍历
    let result = []
    for (let item of dirs) {
        result.push(itemfn(item));
    }
    return Promise.all(result)
}
runParaller(dirs, build).then(() => {
    console.log('成功打包!!!');
    
})
console.log("dirs:", dirs);
