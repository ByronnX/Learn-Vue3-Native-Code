const reactiveHandlers = {}
const shallowReactiveHandlers = {}
const readonlyHandlers = {}
const shallowReadonlyHandlers = {}
export function reactive(target) {
    return createReactObj(target,false,reactiveHandlers)
}
export function shallowReactive(target) {
    return createReactObj(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
    return createReactObj(target, false, readonlyHandlers)
}
export function shallowReadonly(target) {
    return createReactObj(target, false, shallowReadonlyHandlers)
}
function createReactObj(target,isReadonly,baseHandlers) { }