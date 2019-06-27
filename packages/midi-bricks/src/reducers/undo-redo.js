import { createNextState } from 'redux-starter-kit'
import { ActionTypeUndoRedo } from '../actions/undo-redo'

export const undoRedo = {
  [ActionTypeUndoRedo.UNDO_REDO_UPDATE](state, action) {
    const {
      state: { pages, sliders, viewSettings }
    } = action.payload
    
    return createNextState(state, (draftState) => {
      draftState.pages = pages
      draftState.sliders = sliders
      draftState.viewSettings = viewSettings
      return draftState
    })
  },
  [ActionTypeUndoRedo.UNDO_REDO_DELETE](state, action) {
    return createNextState(state, (draftState) => {
      draftState = []
      return draftState
    })
  },
  [ActionTypeUndoRedo.UNDO_REDO_LOAD](state, action) {
    const { state: updatedState } = action.payload
    return createNextState(state, (draftState) => {
      draftState = updatedState
      return draftState
    })
  }
}
