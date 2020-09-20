export const undoRedo = {
  undoRedoUpdate(draftState, action) {
    const {state: { pages, sliders, viewSettings }} = action.payload

    draftState.pages = pages
    draftState.sliders = sliders
    draftState.viewSettings = viewSettings
    return draftState
  },
  undoRedoDelete(draftState) {
    draftState.pages = {}
    draftState.sliders = {}
    draftState.viewSettings = {}
    return draftState
  },
  undoRedoLoad(draftState, action) {
    const { draftState: updatedState } = action.payload
    draftState = updatedState
    return draftState
  }
}
