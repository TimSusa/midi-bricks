import { createNextState } from '@reduxjs/toolkit'
import { pagesInit } from '.'

export const pages = {
  createPage(state, action) {
    const { id } = action.payload

    return createNextState(state, (draftState) => {
      draftState[id] = {
        sliderList: [],
        id,
        label: `Page ${Object.keys(state).length + 1}`
      }
      return draftState
    })
  },
  updatePages(state, action) {
    const { pages } = action.payload
    return createNextState(state, (draftState) => {
      draftState = pages
      return draftState
    })
  },
  updateSliderListOfPage(state, action) {
    const { lastFocusedPage, sliderList } = action.payload
    return createNextState(state, (draftState) => {
      if (lastFocusedPage && Array.isArray(sliderList)) {
        draftState[lastFocusedPage].sliderList = sliderList
      }
      return draftState
    })
  },

  deletePages(state) {
    return createNextState(state, (draftState) => {
      draftState = pagesInit
      return draftState
    })
  }
}
