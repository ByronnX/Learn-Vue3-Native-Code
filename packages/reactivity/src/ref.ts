
import { haseChange, isArray } from "@vue/shared"
import { Track, Trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operation"
/**
 * 有两种ref：一种浅ref，一种深ref
 * 1. function ref(target)
 * 2. function shallowRef(target)
 * 两者都返回一个createRef(target,shallow = false)，但是第二个参数来标志是否是浅的
 */
// 使用 toRef
export function ref(target) {
    return createRef(target)
}
export function shallowRef(target) {
    return createRef(target, true)
}

/**
 * class RefImpl
 * 1. 创建两个属性：一个是__v_isRef(ref标识)，一个是_value
 * 2. 构造函数接受两个值，一个是原始值rawValue，一个是shallow，构造函数内部就是把这个rawValue赋值给类身上的_value
 * 3. 类的属性访问器get，实现响应式：调用Track，把_value返回
 * 4. 类的属性访问器set，实现依赖收集：判断值是否改变，如果改变，把newValue赋值给_value，把newValue赋值给rawValue，调用Trigger。如果值没有改变就this._value = newValue
 */
// 创建类
class RefImpl {
    // 属性
    public __v_isRef = true // ref标识
    public _value
    constructor(public rawValue, public shallow) {
        this._value = rawValue // 用户传入的值
    }

    // 类的属性访问器 实现响应式
    get value() {
        // 获取值
        Track(this, TrackOpTypes.GET, "value") // 收集依赖
        return this._value
    }
    set value(newValue) {
        // 设置值
        // 触发更新
        if (haseChange(newValue, this._value)) {
            this._value = newValue
            this.rawValue = newValue
            Trigger(this, TriggerOpTypes.SET, "value", newValue)
        }
        this._value = newValue
    }
}

/**
 * function createRef(rawValue, shallow = false) 
 * 1. 创建一个RefImpl实例，并返回
 */

function createRef(rawValue, shallow = false) {
    // 创建ref 实例对象
    return new RefImpl(rawValue, shallow)
}
/**
 * function toRef(target, key)
 * 1. 创建一个ObjectRefImpl实例，并返回
 */
// 实现toRef
export function toRef(target, key) {
    return new ObjectRefImpl(target, key)
}
/**
 * class ObjectRefImpl
 * 1. 创建一个标记属性__v_isRef，用来指示这个对象是一个Vue引用对象
 * 2. 构造函数接受目标对象和要跟踪的键
 * 3. getter用于获取目标对象的键对应的值
 * 4. setter用于设置目标对象的键对应的新值
 */
class ObjectRefImpl {
    public __v_isRef = true
    constructor(public target, public key) { }
    get value() {
        return this.target[this.key]
    }
    set value(newValue) {
        this.target[this.key] = newValue
    }
}
/**
 * function toRefs(target)
 * 1. 判断target是否为数组，如果是，则创建一个与target长度相同的新数组；如果不是，则创建一个空对象
 * 2. 遍历target对象的每个键，将每个键对应的值转换为响应式引用，并将其存储在ret中
 * 3. 返回包含响应式引用的对象或数组
 */
// 实现toRefs
export function toRefs(target) {
    // 遍历
    let ret = isArray(target) ? new Array(target.length) : {}
    for (let key in target) {
        ret[key] = toRef(target, key)
    }
    return ret
}