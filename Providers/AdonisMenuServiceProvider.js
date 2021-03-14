'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const NavbarPresenter = require('../src/Presenters/NavbarPresenter')

class AdonisMenuServiceProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Menus', () => {
      const Menu = require('./../src/Menu')
      return new Menu(use('View'), use('Adonis/Src/Config'))
    })
    this.app.alias('Adonis/Menus', 'Menu')

    const mainMenu = use('Menu')
    mainMenu.make('main', (builder) => {
      builder.setPresenter(NavbarPresenter)
      builder.dropdown('Settings', (item) => {
        item.header('Account')
        item.addRoute('/home', 'Home')
        item.divider()
        item.addUrl('/logout', 'Logout')
      }, 3)
    })
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const View = this.app.use('View')
    View.global('menu', (menuName) => {
      const Menu = this.app.use('Menu')
      return Menu.get(menuName)
    })
  }
}

module.exports = AdonisMenuServiceProvider
