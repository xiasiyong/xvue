class Dep {
  constructor () {
    this.subs = []
  }

  // 添加watcher
  addSub (sub) {
    if (sub && sub.update) { // 有update方法才添加
      this.subs.push(sub)
    }
  }
  // 通知watcher调用update方法更新视图
  notify(newValue) {
    this.subs.forEach(sub => {
      sub.update(newValue)
    })
  }
}