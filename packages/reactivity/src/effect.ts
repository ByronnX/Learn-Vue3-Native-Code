export const effect = function (fn, options: any = {}) {
    const effect = createReactEffect(fn, options)
    if (!options.lazy) { // 如果lazy=false的话就执行
        effect()
    }
    return effect
}

let uid = 0
let activeEffect
function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        activeEffect = effect
        return fn()
    }
    effect.id = uid++
    effect._isEffect = true // 区分effect是不是响应式的effect
    effect.raw = fn
    effect.options = options
    return effect
}

let targetMap = new WeakMap()
export function Track(target, type, key) {
   
    let depMap = targetMap.get(target)
    if (!depMap) {
        targetMap.set(target, depMap = new Map()) // 设置对象
    }
    let dep = depMap.get(key)
    if (!dep) {
        depMap.set(key, dep = new Set()) // 对象身上的key
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect) // 对象身上的key如果被effect了的话，就把这个effect给设置进去，set为了去重
    }
    console.log(targetMap)
}