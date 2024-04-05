import { isObject } from "@vue/shared"
import {
  reactiveHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandler"

/**
 * reactive(target): 创建一个深层次的响应式对象，所有嵌套的属性也都是响应式的。
 * shallowReactive(target): 创建一个浅层次的响应式对象，只有第一层的属性是响应式的，更深层次的对象不会变成响应式。
 * readonly(target): 创建一个只读的响应式对象，不能修改对象的属性。
 * shallowReadonly(target): 创建一个浅层次的只读响应式对象，只有第一层的属性是只读的。
 */
export function reactive(target) {
  return createReactObj(target, false, reactiveHandlers)
}
export function shallowReactive(target) {
  return createReactObj(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
  return createReactObj(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
  return createReactObj(target, true, shallowReadonlyHandlers)
}
// 数据结构
const reactiveMap = new WeakMap() // key必须是对象, 自动的垃圾回收
const readonlyMap = new WeakMap()
/**
 * createReactObj函数检查目标对象是否已经是一个代理对象，如果是，则直接返回该代理对象；
 * 如果不是，则创建一个新的代理对象并返回。这个函数使用WeakMap来存储代理对象，确保不会阻止垃圾回收。
 */
function createReactObj(target, isReadonly, baseHandlers) {
  if (!isObject(target)) {
    return target
  }
  // 代理成功后不需要再代理
  const proxymap = isReadonly ? readonlyMap : reactiveMap
  const proxyEs = proxymap.get(target) // 如果有值
  if (proxyEs) {
    return proxyEs
  }
  const proxy = new Proxy(target, baseHandlers)
  // 代理后存入map中
  proxymap.set(target, proxy)
  return proxy
}

// 注意 核心proxy
// let state = reactive({name: '张三'})
