'use strict'

/**
 * @property string url
 * @property string route
 * @property string title
 * @property string name
 * @property string icon
 * @property string parent
 * @property {Array} attributes
 * @property {boolean} active
 * @property {boolean} inActive
 * @property {number} order
 * @property {boolean} [callback] hideWhen
 */

class MenuItem {

  /**
   * @param {[]} properties
   */
  constructor (properties = []) {
    this._properties = properties
    this._children = [];
    this._fillable = [
      'url',
      'router',
      'title',
      'name',
      'icon',
      'parent',
      'attributes',
      'active',
      'order',
    ]
    this.fill(properties)
  }

  /**
   * @param {Object} properties
   */
  fill(properties) {
    Object.keys(properties).forEach((key) => {
      if(this._fillable.includes(key)) {
        this[key] = properties[key]
      }
    })
  }

  /**
   * @param {Object} properties
   */
  static setIconAttribute(properties = {}) {
    if(properties !== null || typeof properties !== 'undefined') {
      if(properties.hasOwnProperty('attributes')
        && properties.attributes.hasOwnProperty('icon')) {
        const icon = properties.attributes.icon
        if(icon) {
          properties['icon'] = icon
          delete properties.attributes.icon
        }
      }
    }
    return properties || {}
  }

  static getRandomName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  }

  /**
   * @param {Array} properties
   */
  static make(properties) {
    properties = MenuItem.setIconAttribute(properties || [])
    return new MenuItem(properties)
  }

  /**
   * @param {Object} attributes
   */
  addChild(attributes) {
    this._children.push(MenuItem(attributes))
    return this
  }

  /**
   *
   * @param title
   * @param callback
   * @param order
   * @param {*[]}attributes
   * @returns {MenuItem}
   */
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
    this._children.push(child)
    return child
  }

  /**
   * @param {string} route
   * @param {string} title
   * @param {Array} parameters
   * @param {Number} order
   * @param {Array} attributes
   */
  addRoute(route, title, parameters = [], order = 0, attributes = []) {
    if(arguments.length === 4) {
      return this.add({
        router: [arguments[0], arguments[2]],
        title: arguments[1],
        attributes: arguments[3]
      })
    }
    const router = [route, parameters]
    return this.add({
      router: router,
      title: title,
      order: order,
      attributes: attributes
    })
  }

  /**
   *
   * @param {string} url
   * @param {string} title
   * @param {Number} order
   * @param {Array} attributes
   */
  addUrl(url, title, order = 0, attributes = []) {
    if(arguments.length === 3) {
      return this.add({
        url: arguments[0],
        title: arguments[1],
        attributes: arguments[2]
      })
    }
    return this.add({
      url: url,
      title: title,
      order: order,
      attributes: attributes || {}
    })
  }

  /**
   *
   * @param {{attributes: any, title: any, url: any}} properties
   */
  add(properties = []) {
    const item = MenuItem.make(properties)
    this._children.push(item)
    return item
  }


  /**
   * @param {number} order
   */
  divider(order = null) {
    const item = MenuItem.make({
      name: 'divider',
      order: order||0
    })
    this._children.push(item)
    return item
  }

  /**
   *
   * @param {string} title
   */
  header(title) {
    const item = MenuItem.make({
      name: 'header',
      title: title
    })
    this._children.push(item)
    return item
  }

  getChildren() {
    const Config = use('Config')
    if(Config.get('menus.ordering') === true) {
      this._children = this._children.sort((a, b) => {
        return a.order - b.order
      })
    }
    return this._children
  }

  getUrl() {
    const route = use('Route')
    if(this.hasOwnProperty('router')) {
      const router = this['router']
      if(router) {
        return route.url(router[0], {params: router[1]})
      }
    }
    if(!this.hasOwnProperty('url') || this['url'] === null) {
      return route.url('#')
    }
    return route.url(this.url)
  }

  getRequest() {
    const route = use('Route')
    const request = use('Adonis/Src/Request')
    return request().replace(route.url('/'), this.getUrl())
  }

  getIcon(defaultIcon = null) {
    if(this['icon'] !== null || this['icon'] !== '') {
      return `<i class="${this['icon']}"></i>`
    }
    if(defaultIcon === null) {
      return defaultIcon
    }
    return `<i class="${defaultIcon}"></i>`
  }

  getAttributes() {
    const attributes = this.attributes || []
    return this._htmlizeAtts(attributes)
  }

  _htmlizeAtts(attributes = []) {
    let values = '';
    attributes.forEach((key, value) => {
      if(key && value) {
        values += `${key}="${value}"`
      }
    })
    return values
  }

  isDivider() {
    return this.is('divider')
  }

  isHeader() {
    return this.is('header')
  }

  is(name) {
    return this.name === name
  }

  hasSubMenu() {
    return this._children.length
  }

  hasActiveOnChild() {
    if(this.inActive()) {
      return false
    }
    return this.hasSubMenu() ? this.getActiveStateFromChild() : false
  }

  inActive () {
    const inactive = this.getInactiveAttribute()
    if(typeof inactive === 'boolean') {
      return inactive
    }
    if(typeof inactive === 'function') {
      return inactive()
    }
    return false
  }

  isActive() {
    if(this.inActive()) {
      return false
    }
    const active = this.getActiveAttribute()
    if(typeof active === 'boolean') {
      return active
    }
    if(typeof active === 'function') {
      return active()
    }
    if(this.hasRoute()) {
      return this.getActiveStateFromRoute()
    }
    return this.getActiveStateFromUrl()
  }

  getActiveAttribute() {
    if(this.hasOwnProperty('attributes') && this.attributes.hasOwnProperty('active')) {
      return this.attributes.active
    }
    return false
  }

  getActiveStateFromChild () {
    this.getChildren().forEach(child => {
      if(child.inActive()) {
        return false
      }
      if(child.hasSubMenu()) {
        if(child.getActiveStateFromChild()) {
          return true
        }
      } else if(child.isActive()) {
        return true
      } else if(child.hasRoute() && child.getActiveStateFromRoute()) {
        return true
      } else if(child.getActiveStateFromUrl()) {
        return true
      }
    })
    return false
  }

  getActiveStateFromUrl () {
    return this.getActiveStateFromRoute()
  }



  hasRoute () {
    return this.hasOwnProperty('router')
  }

  getActiveStateFromRoute () {
    const route = use('Route')
    const getHttp = this.hasRoute() ? this.router[0] : this.getUrl()
    const match = route.match(getHttp, 'GET')
    if(match && match.hasOwnProperty('url')) {
      return match.url === getHttp
    }
  }

  getInactiveAttribute () {
    if(this.hasOwnProperty('attributes') && this.attributes.hasOwnProperty('inactive')) {
      return this.attributes.inactive
    }
    return false
  }

  hideWhen(hidden) {
    if(typeof hidden === 'function') {
      this._hideWhen = hidden()
    } else {
      this._hideWhen = hidden
    }
  }

  hidden() {
    if(typeof this._hideWhen === 'function') {
      return this._hideWhen() === true
    }
    return this._hideWhen === true
  }

  /**
   *
   * @returns {[{attributes: *[], title: *, order: number}|{name: string}]}
   */
  getProperties() {
    return this._properties
  }

  toArray() {
    return this._properties
  }
}

module.exports = MenuItem
