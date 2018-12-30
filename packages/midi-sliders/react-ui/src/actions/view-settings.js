const createActions = require('./create-actions.js').createActions
const createActionTypes = require('./create-action-types').createActionTypes

const TypeViewSettings = [
  'TOGGLE_PAGE',
  'TOGGLE_LIVE_MODE',
  'TOGGLE_LAYOUT_MODE',
  'TOGGLE_COMPACT_MODE',
  'TOGGLE_SETTINGS_MODE',
  'TOGGLE_SETTINGS_DIALOG_MODE',
  'TOGGLE_AUTO_ARRANGE_MODE',
  'CHANGE_THEME',
  'UPDATE_VIEW_SETTINGS',
  'DELETE_PAGE_FROM_FOOTER',
  'DELETE_FOOTER_PAGES',
  'SWAP_FOOTER_PAGES',
  'CHANGE_FOOTER_PAGE',
  'SET_AVAILABLE_DRIVERS',
  'SET_FOOTER_BUTTON_FOCUS'
]

const ActionTypeViewSettings = createActionTypes(TypeViewSettings)

module.exports = {
  ...createActions(ActionTypeViewSettings),
  ActionTypeViewSettings,
}
