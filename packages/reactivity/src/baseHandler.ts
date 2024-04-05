import {
  hasOwn,
  isArray,
  isIntegerKey,
  isObject
} from "@vue/shared"
import { reactive, readonly } from "./reactive"
import { Track, Trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operation"

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

// get方法------------------------------------------------------
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
// set方法------------------------------------------------------
const set = createSetter()
// 本来set也有四个，但是因为readonly设置不了属性，所以只需要两个
const shallowSet = createSetter(true)
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key]
    // console.log(target, key, value, receiver, oldValue);
    const hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    // 判断是数组还是对象
    // 添加还是修改 (Number(key) < target.length)数组下标和数组长度比较, 小于是修改
    // haskey为false 新增 true修改
    if (!hasKey) {
      // 新增
      console.log('新增');
      Trigger(target,TriggerOpTypes.SET,key,value)
    } else {
      // 修改
      console.log('修改');
      if (oldValue == value) {
        return 
      }
      Trigger(target, TriggerOpTypes.SET, key, value,oldValue)
    }
    return result
  }
}

// 四个handler方法------------------------------------------------------
export const reactiveHandlers = {
  get,
  set,// 原版
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet // 原版set的基础上加上shallow的flag判断
}
export const readonlyHandlers ={
  get: readonlyGet,
  // 只读的话就是这样返回
  set: (target, key, value) => {
    console.log(`set on ${key} is failed`);
  }
}
export const shallowReadonlyHandlers ={
  get: shallowReadonlyGet,
  // 只读的话就是这样返回
  set: (target, key, value) => {
    console.log(`set on ${key} is failed`);
  }
}
