import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { initApp } from '../init'
import { initId } from '../../reducers/slider-list'
import localforage from 'localforage'
const { loadFile, deleteAll } = sliderListActions
const { updateViewSettings, setLastFocusedPage, deleteFooterPages } = viewSettingsActions
const { updatePages } = pageActions


// todo: get rid of promise.all
export function thunkLoadFile(content, presetName) {
  return async function(dispatch, getState) {
    let promArray = []

    promArray.push(dispatch(deleteAll()))
    window.localStorage.clear()
    window.sessionStorage.clear()
    const {
      viewSettings = {},
      viewSettings: { availableDrivers } = {},
      sliders: { sliderList = [] } = {},
      pages
    } = content

    if (pages) {
      promArray.push(dispatch(updatePages({ pages })))
      await localforage.setItem('pages', pages)
    } else {
      const {
        pages: oldPages,
        viewSettings: { lastFocusedPage: lfp }
      } = getState()
      const oldPresetTransformedPages = {
        //...oldPages,
        [lfp]: {
          ...oldPages[lfp],
          sliderList: sliderList
        }
      }
      promArray.push(
        dispatch(updatePages({ pages: oldPresetTransformedPages }))
      )
      promArray.push(
        dispatch(deleteFooterPages())
      )
    }

    promArray.push(
      dispatch(loadFile({ presetName, content, lastFocusedPage: initId }))
    )

    promArray.push(dispatch(setLastFocusedPage({ lastFocusedPage: initId })))
    const drivers = availableDrivers || {
      inputs: {
        None: {
          ccChannels: [],
          noteChannels: []
        }
      },
      outputs: {
        None: {
          ccChannels: [],
          noteChannels: []
        }
      }
    }

    if (pages) {
      promArray.push(
        dispatch(
          updateViewSettings({
            viewSettings: { ...viewSettings, availableDrivers: drivers }
          })
        )
      )
    }

    // Will load content to view-settings-reducer
    sliderList &&
      Array.isArray(sliderList) &&
      promArray.push(
        dispatch(
          updateViewSettings({
            viewSettings: { ...viewSettings, availableDrivers: drivers },
            sliderList: sliderList
          })
        )
      )
    promArray.push(dispatch(initApp()))
    window.sessionStorage.clear()
    return Promise.all(promArray)
  }
}
