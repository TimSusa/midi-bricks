
export const ActionTypeRack = {
  ADD_RACK_ITEM: 'ADD_RACK_ITEM',
  DELETE_RACK_ITEM: 'DELETE_RACK_ITEM',
  MUTE_RACK_ITEM: 'MUTE_RACK_ITEM',
  UNMUTE_RACK_ITEM: 'UNMUTE_RACK_ITEM'
}

export function addRackItem (rackItem) {
  return {
    type: ActionTypeRack.ADD_RACK_ITEM,
    payload: rackItem
  }
}

// Async Function expample with redux-thunk
export function muteRackItem (rackItemId) {
  // here you could do API eg

  return (dispatch, getState) => {
    dispatch({ type: ActionTypeRack.MUTE_RACK_ITEM, payload: rackItemId })
  }
}

export function unmuteRackItem (rackItemId) {
  return {
    type: ActionTypeRack.UNMUTE_RACK_ITEM,
    payload: rackItemId
  }
}

export function deleteRackItem (rackItemId) {
  return {
    type: ActionTypeRack.DELETE_RACK_ITEM,
    payload: rackItemId
  }
}
