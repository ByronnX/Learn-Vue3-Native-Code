# Vue 3

## 手写 vue, 跟着 B 站的视频敲的 vue 源码,提交代码也是对自己的一个监督,大家一起加油!

项目里面的一些安装包版本与视频里老师用的不一样,注意版本问题,太高版本的会有一些语法错误,目前的 vue 源码也升级了,可以下载一个, 写的时候对照看

我写的时候本地的一些版本信息: node v18.18.0 npm 10.2.0

项目启动打包会报一个错,

```
package subpath './package.json' is not defined by "exports" in D:\githupprojects\study\vue3-write\node_modules\tslib\package.json
```

是因为 node*modules 下面的 tslib 包问题,在 package.json 文件的 exports 对象,最后一行添加 "./*": "./\*" 就可以了
完整的 exports 代码

```
"exports": {
        ".": {
            "module": "./tslib.es6.js",
            "import": "./modules/index.js",
            "default": "./tslib.js"
        },
        "./": "./",
        "./*": "./*"
    }
```

尝试换了版本,但是会报其他错误, 所以版本不同可能会出现不同问题

# computed
计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。只在某些特殊场景中你可能才需要用到“可写”的属性，你可以通过同时提供 getter 和 setter 来创建