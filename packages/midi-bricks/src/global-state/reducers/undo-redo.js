import { createNextState } from '@reduxjs/toolkit'

export const undoRedo = {
  undoRedoUpdate(state, action) {
    const {state: { pages, sliders, viewSettings }} = action.payload

    return createNextState(state, (draftState) => {
      draftState.pages = pages
      draftState.sliders = sliders
      draftState.viewSettings = viewSettings
      return draftState
    })
  },
  undoRedoDelete(state) {
    return createNextState(state, (draftState) => {
      draftState.pages = {}
      draftState.sliders = {}
      draftState.viewSettings = {}
      return draftState
    })
  },
  undoRedoLoad(state, action) {
    const { state: updatedState } = action.payload
    return createNextState(state, (draftState) => {
      draftState = updatedState
      return draftState
    })
  }
}
