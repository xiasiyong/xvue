class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    // 方便在getter的时候添加依赖
    Dep.target = this
    // 触发getter， 添加watcher到dep中
    this.oldValue = this.vm[key]
    // 清空Dep.target, 防止同一个watcher被重复添加
    Dep.target = null
  }

  update() {
    const newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue)
  }
}