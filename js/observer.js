class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, val) {
    const that = this
    // 如果val也是object，则递归将val的属性也变成响应式的
    this.walk(val)
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 防止重复添加，触发该操作后，会在watcher中将Dep.target设置为null
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (val === newValue) {
          return
        }
        // 如果新赋值的newValue也是对象，则转换成响应式的
        that.walk(newValue)
        val = newValue
        // 同时更新
        dep.notify()
      }
    })
  }
}