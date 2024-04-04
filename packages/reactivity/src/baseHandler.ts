import {
  isObject
} from "@vue/shared"
import { reactive, readonly } from "./reactive"
import { Track } from "./effect"
import { TrackOpTypes } from "./operation"

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

// get方法
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    
    // 判断
    if (!isReadonly) {
      // 是否只读
      // 收集依赖 effect      
      Track(target, TrackOpTypes.GET, key)
    }
    if (shallow) {
      // 浅层代理
      return res
    }
    // res是一个对象 递归 懒代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
// set方法
const set = createSetter()
const shallowSet = createSetter(true)
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    return result
  }
}

// 四个handler方法
export const reactiveHandlers = {
  get,
  set,// 原版
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet // 原版set的基础上加上shallow的flag判断
}
export const readonlyHandlers =
{
  get: readonlyGet,
  // 只读的话就是这样返回
  set: (target, key, value) => {
    console.log(`set on ${key} is failed`);
  }
}

export const shallowReadonlyHandlers =
{
  get: shallowReadonlyGet,
  // 只读的话就是这样返回
  set: (target, key, value) => {
    console.log(`set on ${key} is failed`);
  }
}
