class Compiler {
  constructor (vm) {
    this.vm = vm
    this.$el = vm.$el
    this.compile(this.$el)
  }
  // 编译模板，处理指令和插值表达式
  compile (node) {
    const childNodes = node.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 编辑文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 编译元素节点
        this.compileElement(node)
      }

      // 如果node还包含有子节点，则需要递归处理
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement (node) {
    const attributes = node.attributes
    Array.from(attributes).forEach(attr => {
      let attrName = attr.name
      const key = attr.value
      if (this.isDirective(attrName)) {
        // v-text -> text
        attrName = attrName.substr(2)
        this.update(node, attrName, key)
      }
    })
  }
  update (node, attrName, key) {
    const updaterFn = this[attrName + 'Updater']
    updaterFn && updaterFn.call(this, node, this.vm[key], key)
  }
  textUpdater (node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  modelUpdater (node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  htmlUpdater(node, value, key) {
    node.innerHTML = value
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue
    })
  }
  onUpdater(node, value, key) {
    node.addEventListener('click', this.vm.$options.methods[key])
  }
  // 编译文本节点，处理插值表达式
  compileText (node) {
    const reg = /\{\{(.+?)\}\}/
    const textContent = node.textContent
    if (reg.test(textContent)) {
      const key = RegExp.$1.trim()
      node.textContent = this.vm[key]
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  // 判断属性是否是指令，以v-开头的都是
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }
}