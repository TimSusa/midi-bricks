import { pagesInit } from '../'

export const pages = {
  createPage(draftState, action) {
    const { id } = action.payload

    draftState[id] = {
      sliderList: [],
      id,
      label: `Page ${Object.keys(draftState).length + 1}`
    }
    return draftState
  },
  updatePages(draftState, action) {
    draftState = action.payload.pages

    return draftState
  },
  // updateSliderListOfPage(draftState, action) {
  //   const { lastFocusedPage, sliderList } = action.payload

  //   if (lastFocusedPage && Array.isArray(sliderList)) {
  //     draftState[lastFocusedPage].sliderList = sliderList
  //   }
  //   return draftState
  // },

  deletePages(draftState) {
    draftState = pagesInit
    return draftState
  }
}
