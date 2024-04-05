import { isArray, isIntegerKey } from "@vue/shared"
import { TriggerOpTypes } from "./operation"

// 交给函数处理创建effect并返回 -------------------------------------------------
export const effect = function (fn, options: any = {}) {
    const effect = createReactEffect(fn, options)
    if (!options.lazy) { // 如果lazy=false的话就执行
        effect()
    }
    return effect
}

let uid = 0 // 唯一id
let activeEffect // 当前激活的effect
let effectStack = [] // 栈
// 创建effect -------------------------------------------------
function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        // 避免重复使用
        if (!effectStack.includes(effect)) {
            try {
                // 入栈
                activeEffect = effect // 存储当前激活的effect
                effectStack.push(effect) // 入栈
                return fn()
            } finally {
                // 出栈
                effectStack.pop()
                // 更改当前激活的唯一标识为栈的最新一项
                activeEffect = effectStack[effectStack.length - 1]
            }
       }
    }
    // 附带属性和唯一标识
    effect.id = uid++ // 唯一id
    effect._isEffect = true // 区分effect是不是响应式的effect
    effect.raw = fn // 原始方法
    effect.options = options // 原始选项
    return effect 
}

// 对象和effect的映射表
let targetMap = new WeakMap()
// 收集effect 在获取数据的时候触发 get-------------------------------------------------
export function Track(target, type, key) {
    if (!activeEffect) { // 如果get的时候没有在effect中使用就直接终止
        return;
    }
    let depMap = targetMap.get(target) // 获取对象对应的map
    if (!depMap) { // 如果没有就新增
        targetMap.set(target, depMap = new Map()) // 设置对象
    }
    let dep = depMap.get(key) // 获取属性对应的map
    if (!dep) { // 如果没有就新增
        depMap.set(key, dep = new Set()) // 对象身上的key
    }
    if (!dep.has(activeEffect)) { // 如果没有就新增
        dep.add(activeEffect) // 对象身上的key如果被effect了的话，就把这个effect给设置进去，set为了去重
    }
    // console.log(targetMap)
}

// 触发更新-------------------------------------------------
export function Trigger(target, type, key?, newValue?, oldValue?) {
    // console.log(targetMap,target, type, key, newValue, oldValue);
    const depsMap = targetMap.get(target)
    // 判断是否有目标对象
    if (!depsMap) return
    let effectSet = new Set() // set格式可以去重
    // 封装函数为了可以多次调用
    // 函数作用是把传入的map中的effect添加到effectSet中
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach((effect) => effectSet.add(effect))
        }
    }
    add(depsMap.get(key)) // 获取当前属性的effect

    // 处理数组 key === length
    // 当你正常获取值的时候，突然把数组长度变小了，此时需要重新执行effect，效果是：让他把原来的值改为undefined
    if (key === "length" && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === "length" || key >= newValue) {
                // 当key为length或者key大于等于新值时，调用add方法，把里面的effect循环遍历添加到effectSet里面
                add(dep)
            }
        })
    } else {
        // 可能是对象
        if (key != undefined) {
            add(depsMap.get(key)) // 获取当前属性的effect并添加到effectSet中
        }
        switch (type) { 
            // 观测type，如果是add的行为
            case TriggerOpTypes.ADD:
                // 这种情况：arr1[100] = 10
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get("length"))
                }
        }
    }
    // 执行
    effectSet.forEach((effect: any) => {
        if (effect.options.sch) {
            effect.options.sch(effect)
        } else {
            effect()
        }
    })
}