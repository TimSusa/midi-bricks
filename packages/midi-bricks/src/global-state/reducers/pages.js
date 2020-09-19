import { createNextState } from '@reduxjs/toolkit'
import { ActionTypePages } from '../actions/pages'
import { pagesInit } from '.'

export const pages = {
  [ActionTypePages.CREATE_PAGE](state, action) {
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
  [ActionTypePages.UPDATE_PAGES](state, action) {
    const { pages } = action.payload
    return createNextState(state, (draftState) => {
      draftState = pages
      return draftState
    })
  },
  [ActionTypePages.UPDATE_SLIDER_LIST_OF_PAGE](state, action) {
    const { lastFocusedPage, sliderList } = action.payload
    return createNextState(state, (draftState) => {
      if (lastFocusedPage && Array.isArray(sliderList)) {
        draftState[lastFocusedPage].sliderList = sliderList
      }
      return draftState
    })
  },

  [ActionTypePages.DELETE_PAGES](state) {
    return createNextState(state, (draftState) => {
      draftState = pagesInit
      return draftState
    })
  }
}
