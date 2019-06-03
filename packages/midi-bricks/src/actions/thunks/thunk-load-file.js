import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pagesx'
import { initApp } from '../init'
import { initId } from '../../reducers/slider-list'

const { loadFile, deleteAll } = sliderListActions
const { updateViewSettings, setLastFocusedPage } = viewSettingsActions
const { updatePages, updateSliderListOfPage } = pageActions

export function thunkLoadFile(content, presetName) {
  return async function(dispatch, getState) {
    let promArray = []

    promArray.push(dispatch(deleteAll()))
    window.localStorage.clear()

    const {
      viewSettings = {},
      viewSettings: { availableDrivers, lastFocusedPage } = {},
      sliders: { sliderList = [] } = {},
      pages
    } = content



    if (pages) {
      promArray.push(dispatch(updatePages({ pages })))
    } else {
      const {pagesx: oldPages, viewSettings: {lastFocusedPage: lfp} } = getState()
      const oldPresetTransformedPages = {
        ...oldPages,
        [lfp]: {
          ...oldPages[lfp],
          sliderList: sliderList
        }

      }
      promArray.push(dispatch(updatePages({ pages: oldPresetTransformedPages })))
    }

    promArray.push(
      dispatch(loadFile({ presetName, content, lastFocusedPage: initId }))
    )
    // sliderList && promArray.push(
    //   dispatch(updateSliderListOfPage({ lastFocusedPage: initId, sliderList }))
    // )

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
    return Promise.all(promArray)
  }
}
