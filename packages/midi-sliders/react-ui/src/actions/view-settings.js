
export const ActionTypeViewSettings = {
  TOGGLE_LAYOUT_MODE: 'TOGGLE_LAYOUT_MODE',
  INTEND_UPDATE_LIST_ORDER: 'INTEND_UPDATE_LIST_ORDER'
}

export function toggleLayoutMode (payload) {
  return {
    type: ActionTypeViewSettings.TOGGLE_LAYOUT_MODE,
    payload
  }
}

export function updateListOrder (payload) {
  return {
    type: ActionTypeViewSettings.INTEND_UPDATE_LIST_ORDER,
    payload
  }
}
