'use strict'

const MenuItem = require('../MenuItem')
const BootstrapProvider = require('../Presenters/BootstrapPresenter')

class MenuBuilder {
  constructor (menu, Config) {
    this._menu = menu
    /**
     * @type {Config}
     * @private
     */
    this._Config = Config
    this._items = []
    /**
     * @type {PresenterInterface}
     * @private
     */
    this._presenter = () => {}
    this._styles = []
    this._prefixUrl = null
    this._view = ''
    /**
     * @type {View}
     * @private
     */
    this._views = null
    this._ordering = false
    this._bindings = []

  }

  getName() {
    return this._menu
  }

  whereTitle(title, callback = null) {
    const item = this.findBy('title', title)
    if(typeof callback === 'function') {
      return callback(item)
    }
    return item
  }

  findBy(key, value) {
    return this._items.find(n => n[key] === value)
  }

  setViewContract(contract) {
    this._views = contract
    return this
  }

  setView(view) {
    this._view = view
    return this
  }

  setPrefixUrl(prefix) {
    this._prefixUrl = prefix
    return this
  }
  setStyles(styles = []) {
    this._styles = styles
  }

  setPresenter(presenter) {
    this._presenter = presenter !== null ? presenter : BootstrapProvider
  }

  getPresenter() {
    return new this._presenter
  }

  style(name) {
    if(this.hasStyle(name)) {
      this.setPresenter(this.getStyle(name))
    }
    return this
  }

  hasStyle (name) {
    return this.getStyles().find(s => s === name)
  }

  getStyle (name) {
    return this.getStyles()[name]
  }

  getStyles () {
    return this._styles || this._Config.get('menus.styles')
  }

  setPresenterFromStyle(style) {
    this.setPresenter(this.getStyle(style))
  }

  setBindings(bindings = []) {
    this._bindings = bindings || []
    return this
  }

  resolve(key = []) {
    if(key.length > 1) {
      key.forEach(k => {
        key[k] = this.resolve(k)
      })
    } else if(typeof key === 'string') {
      let result = null
      const regex = /{[\\s]*?([^\\s]+)[\\s]*?}/i
      for(let matches; result === regex.exec(key); matches.push(result)) {
        matches.forEach(m => {
          if(this._bindings.hasOwnProperty(m[1])) {
            key = key.replace(`/${m[0]}/g`, this._bindings[matches[1]])
          }
        })
      }

    }
    return key
  }

  /**
   * @param {[MenuItem]} items
   */
  resolveItems(items = []) {
    let resolver = (properties) => {
      return this.resolve(properties)
    }
    const totalItems = items.length
    for (let i = 0; i < totalItems; i++) {
      items[i].fill(items[i].getProperties().map(resolver))
    }
  }

  add(properties) {
    const item = MenuItem.make(properties)
    this._items.push(item)
    return item
  }

  dropdown(title, callback, order = 0, attributes) {
    let properties = { title: title, order: order, attributes: attributes }
    if(arguments.length === 3) {
      properties = {
        title: arguments[0],
        attributes: arguments[2]
      }
    }
    const child = MenuItem.make(properties)
    callback(child)
    this._items.push(child)
    return child
  }

  addRoute(route, title, parameters = [], order = 0, attributes = []) {
    if(arguments.length === 4) {
      return this.add({
        router: [arguments[0], arguments[2]],
        title: arguments[1],
        attributes: arguments[3]
      })
    }
    const router = [route, parameters]
    const item = MenuItem.make({
      router: router,
      title: title,
      parameters: parameters,
      attributes: attributes,
      order: order
    })
    this._items.push(item)
    return item
  }

  formatUrl(url) {
    const uri = this._prefixUrl !== null ? this._prefixUrl.concat(url) : url;

    return uri === '/' ? '/' : uri.trim()
  }

  url(url, title, order = 0, attributes = []) {
    const params = {
      url: this.formatUrl(url),
      title: title,
      attributes: attributes,
      order: order
    }
    const child = this.add(params)
    this._items.push(child)
    return child
  }

  divider(order = null) {
    const params = {
      name: 'divider',
      order: order
    }
    this._items.push(new MenuItem(params))
    return this
  }

  header(title, order = null) {
    const params = {
      name: 'header',
      title: title,
      order: order
    }
    this._items.push(new MenuItem(params))
    return this
  }

  count() {
    return this._items.length
  }

  destroy() {
    this._items = []
    return this
  }

  render(presenter) {
    this.resolveItems(this.items)
    if(this._view === null || typeof this._view === 'undefined') {
      return this.renderView(presenter)
    }
    if(this.hasStyle(presenter)) {
      return this.setPresenterFromStyle(presenter)
    }
    if(presenter !== null || typeof presenter !== 'undefined') {
      this.setPresenter(presenter)
    }

    if(presenter === null || typeof presenter === 'undefined') {
      this.setPresenter(this._presenter)
    }
    return this.renderMenu()
  }

  renderView(presenter = null) {
    const view = presenter !== null ? presenter : this._view
    const data = {
      items: this.getOrderedItems()
    }
    return this._views.render(view, data)
  }

  getOrderedItems() {
    if(this._Config.get('menus.ordering') === true) {
      return this._items.sort((a, b) => {
        return a.order - b.order
      })
    } else {
      return this._items
    }
  }

  renderMenu() {
    const presenter = this.getPresenter()
    let string = presenter.getOpenTagWrapper()

    this.getOrderedItems().forEach(i => {
      if(i.hidden()) {
        return false
      }
      if(i.hasSubMenu()) {
        string += presenter.getMenuWithDropDownWrapper(i)
      } else if(i.isHeader()) {
        string += presenter.getHeaderWrapper(i)
      } else if(i.isDivider()) {
        string += presenter.getDividerWrapper()
      } else {
        string += presenter.getMenuWithoutDropdownWrapper(i)
      }
    })
    string += presenter.getCloseTagWrapper()
    return string
  }
}

module.exports = MenuBuilder
