class Vue {
  constructor (options) {
    // 1. 保存options中的选项到属性中
    this.$options = options
    this.$data = options.data
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 吧options.data中的属性转换成getter/setter，并注入到xvue实例中
    this._proxyData(this.$data)
    // 3. 调用Observer方法，监听数据的变化
    new Observer(this.$data)
    // 4. 调用compiler方法，解析指令和插值表达式
    new Compiler(this)
  }
  _proxyData (data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get () {
          return data[key]
        },
        set (newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}