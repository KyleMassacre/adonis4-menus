const Presenter = require('./Presenter')

class BootstrapPresenter extends Presenter {

  getCloseTagWrapper() {
    return "</ul>"
  }

  getActiveStateOnChild(item, state = 'active') {
    return item.hasActiveOnChild() ? state : ''
  }

  getDividerWrapper() {
    return '<li class="divider"></li>'
  }

  /**
   * @param {MenuItem} item
   */
  getHeaderWrapper(item) {
    return `<li class="dropdown-header">${item.title}</li>`
  }

  getActiveState(item, state = ' class="active"') {
    return item.isActive() ? state : ''
  }

  getOpenTagWrapper() {
    return "<ul class='navbar-nav ml-auto'>"
  }

  getMenuWithDropDownWrapper(item) {
    const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    return `<li class="${this.getActiveStateOnChild(item)} panel panel-default" id="dropdown">
        <a data-toggle="collapse" href="#" data-target="#${randomString}">${item.getIcon()} ${item.title} <span class="caret"></span></a>
        <div id="${randomString}" class="panel-collapse collapse ${this.getActiveStateOnChild(item, 'in')}">
            <div class="panel-body">
                <ul class="navbar-nav">
                    ${this.getChildMenuItems(item)}
                </ul>
            </div>
        </div>`
  }

  getMenuWithoutDropdownWrapper(item) {
    return `<li ${this.getActiveState(item)}>
        <a href="${item.getUrl()}" ${item.getAttributes()}>
        ${item.getIcon()} ${item.title}</a>`
  }

  /**
   * @param {MenuItem} item
   */
  getMultiLevelDropdownWrapper(item) {
    return this.getMenuWithDropDownWrapper(item)
  }
}

module.exports = BootstrapPresenter
