const PresenterInterface = require('./PresenterInterface')

class Presenter extends PresenterInterface {

  getChildMenuItems(item) {
    let results = ''
    item.getChildren().forEach(child => {
      if(child.hidden()) {
        return
      }
      if(child.hasSubMenu()) {
        results += this.getMultiLevelDropdownWrapper(child)
      } else if (child.isHeader()) {
        results += this.getHeaderWrapper(child)
      } else if(child.isDivider()) {
        results += this.getDividerWrapper()
      } else {
        results += this.getMenuWithoutDropdownWrapper(child)
      }
    })
    return results
  }
}

module.exports = Presenter
