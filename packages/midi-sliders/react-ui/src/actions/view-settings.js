const createActions = require('./create-actions.js').createActions

const ActionTypeViewSettings = {
  TOGGLE_LAYOUT_MODE: 'TOGGLE_LAYOUT_MODE',
  UPDATE_LIST_ORDER: 'UPDATE_LIST_ORDER'
}

module.exports = {
  ...createActions(ActionTypeViewSettings),
  ActionTypeViewSettings
}
