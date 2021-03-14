'use strict'

class PresenterInterface {

  /**
   * Get open tag wrapper.
   *
   * @return string
   */
  getOpenTagWrapper() {
    throw new Error('Method not implemented')
  }

  /**
   * Get close tag wrapper.
   *
   * @return string
   */
  getCloseTagWrapper() {
    throw new Error('Method not implemented')
  }

  /**
   * Get menu tag without dropdown wrapper.
   *
   *
   * @return string
   * @param {MenuItem} item
   */
  getMenuWithoutDropdownWrapper(item) {
    throw new Error('Method not implemented')
  }

  /**
   * Get divider tag wrapper.
   *
   * @return string
   */
  getDividerWrapper() {
    throw new Error('Method not implemented')
  }

  /**
   * Get divider tag wrapper.
   *
   *
   * @return string
   * @param {MenuItem} item
   */
  getHeaderWrapper(item) {
    throw new Error('Method not implemented')
  }

  /**
   * Get menu tag with dropdown wrapper.
   *
   *
   * @return string
   * @param {MenuItem} item
   */
  getMenuWithDropDownWrapper(item) {
    throw new Error('Method not implemented')
  }

  /**
   * Get child menu item: MenuItems.
   *
   *
   * @return string
   * @param {MenuItem} item
   */
  getChildMenuItems(item) {
    throw new Error('Method not implemented')
  }

}

module.exports = PresenterInterface
