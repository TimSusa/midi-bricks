import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { initApp } from '../init'
import { PAGE_TYPES } from '../../reducers'

const { loadFile, deleteAll } = sliderListActions
const { togglePage, updateViewSettings } = viewSettingsActions

export function thunkLoadFile(content, presetName) {

  return async function(dispatch, getState) {
    let promArray = []

    promArray.push(dispatch(deleteAll()))
    window.localStorage.clear()

    // will load content to slider-list-reducer
    promArray.push(dispatch(loadFile({ presetName, content })))

    const {
      version = '',
      viewSettings = {},
      viewSettings: { availableDrivers } = {},
      sliders: { sliderList, pages } = {}
    } = content
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

    // Either will will have pages or sliderList
    if (pages) {
      promArray.push(
        dispatch(
          updateViewSettings({
            version,
            viewSettings: { ...viewSettings, availableDrivers: drivers },
            pages
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
            version,
            viewSettings: { ...viewSettings, availableDrivers: drivers },
            sliderList: sliderList,
            pages
          })
        )
      )
    promArray.push(dispatch(initApp()))
    promArray.push(
      dispatch(
        togglePage({
          pageType: PAGE_TYPES.GLOBAL_MODE
        })
      )
    )
    return Promise.all(promArray)
  }
}
