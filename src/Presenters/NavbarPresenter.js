const Presenter = require('./Presenter')

class NavbarPresenter extends Presenter {

  /**
   * {@inheritdoc }.
   */
  getOpenTagWrapper () {
    return `<ul class="nav navbar-nav">`
  }

  /**
   * {@inheritdoc }.
   */
  getCloseTagWrapper () {
    return `</ul>`
  }

  /**
   * {@inheritdoc}.
   */
  getMenuWithoutDropdownWrapper (item) {
    return `<li ${this.getActiveState(item)}><a href="${item.getUrl()}" ${item.getAttributes()}>${item.getIcon()} ${item.title}</a></li>`
  }

  /**
   * {@inheritdoc }.
   */
  getActiveState (item, state = ' class="active"') {
    return item.isActive() ? state : ''
  }

  /**
   * Get active state on child items.
   *
   * @param item
   * @param state
   *
   * @return null|string
   */
  getActiveStateOnChild (item, state = 'active') {
    return item.hasActiveOnChild() ? state : ''
  }

  /**
   * {@inheritdoc }.
   */
  getDividerWrapper () {
    return '<li class="divider"></li>'
  }

  /**
   * {@inheritdoc }.
   */
  getHeaderWrapper (item) {
    return `<li class="dropdown-header">${item.title}</li>`
  }

  /**
   * {@inheritdoc }.
   */
  getMenuWithDropDownWrapper (item) {
    return `<li class="dropdown ${this.getActiveStateOnChild(item, ' active')} NavbarPresenter">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">${item.getIcon()} ${item.title}
                <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
                ${this.getChildMenuItems(item)}
            </ul>
          </li>`
  }

  /**
   * Get multilevel menu wrapper.
   *
   * @param item
   *
   * @return string`
   */
  getMultiLevelDropdownWrapper (item) {
    return `<li class="dropdown ${this.getActiveStateOnChild(item, ' active')} NavBarPresenter">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                ${item.getIcon()} ${item.title}
                <b class="caret pull-right caret-right"></b>
            </a>
            <ul class="dropdown-menu">
                ${this.getChildMenuItems(item)}
            </ul>
        </li>`
  }
}

module.exports = NavbarPresenter
