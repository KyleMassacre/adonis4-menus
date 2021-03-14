'use strict'

const MenuBuilder = require('../MenuBuilder')

class Menu {

  constructor (viewFactory, Config) {
    /**
     *
     * @type {[MenuBuilder]}
     * @private
     */
    this._menus = []
    this._Config = Config
    /**
     * @type {View}
     * @private
     */
    this._viewFactory = viewFactory
  }

  make(name, callback){
    return this.create(name, callback)
  }

  create(name, callback) {
    const builder = new MenuBuilder(name, this._Config)
    builder.setViewContract(this._viewFactory)
    this._menus.push(builder)
    return callback(builder)
  }
  has(name) {
    return this._menus.find(m => m.getName() === name)
  }
  instance(name) {
    this.has(name) ? this._menus.filter(m => m.getName() === name) : null
  }

  modify(name, callback) {
    const menu = this._menus.filter(m => m.getName() === name)[0]
    callback(menu)
  }

  get(name, presenter = null, bindings = []) {
    return this.has(name) ?
      this._menus.filter(m => m.getName() === name)[0].setBindings(bindings || []).render(presenter) :
      null
  }

  render(name, presenter = null, bindings = []) {
    return this.get(name, presenter, bindings)
  }

  style() {
    this._viewFactory.render('menus.style')
  }

  all() {
    return this._menus
  }

  count() {
    return this._menus.length
  }

  destroy() {
    this._menus = []
  }
}

module.exports = Menu
