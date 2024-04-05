import { isFunction } from "@vue/shared";
import { effect } from "./effect";
/**
 * 计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。只在某些特殊场景中你可能才需要用到“可写”的属性，你可以通过同时提供 getter 和 setter 来创建
 */
/**
 * function computed(getterOrOptions)
 * 1. 初始化getter、setter变量
 * 2. 处理传入参数的类型，如果是function就处理把传入进来的参数给getter，因为computed默认是只读的不可修改，所以如果是function的参数，setter就提示报错
 * 3. 如果不是function之外的情况就是传入进来get，set方法，那就分开赋值给getter，setter
 * 4. 把getter、setter变量传入一个新的函数返回一个新的computed实例叫做 ComputedRefImpl
 */
export function computed(getterOrOptions) {
    let getter, setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions
        setter = () => {
            console.warn('computed is readonly')
        }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    return new ComputedRefImpl(getter,setter)
}

/**
 * class ComputedRefImpl 
 * 1. 定义属性: _dirty（是不是默认执行）, _value, effect
 * 2. 创建构造函数，接收getter、setter变量。执行effect方法，传入getter，和配置项（配置项内容有lazy，默认不执行。有属性sch，把_dirty设置为true，作用是如果缓存过了就不用再执行了）赋值给effect变量。
 * 3. 定义get方法，如果_dirty为true，执行effect()方法并把结果赋值给_value，把_dirty设置为false，返回_value。
 * 4. 定义set方法，传入newValue执行this.setter方法。
 */
class ComputedRefImpl {
    public _dirty = true;
    public _value;
    public effect;
    constructor(getter, public setter) {
        this.effect = effect(getter, {
            lazy: true,
            sch: () => {
                if (!this._dirty) {
                    this._dirty = true;
                }
            }
        })
    }
    get value() {
        if (this._dirty) {
            this._value = this.effect()
            this._dirty = false
        }
        return this._value
    }
    set value(newValue) {
        this.setter(newValue)
    }
}