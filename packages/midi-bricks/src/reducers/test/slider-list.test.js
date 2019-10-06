import { sliders } from '../slider-list'
import { mockStore } from './mock-store'
const {
  INIT_FAILED,
  INIT_MIDI_ACCESS_OK,
  MIDI_MESSAGE_ARRIVED,
  RESET_VALUES,
  HANDLE_SLIDER_CHANGE,
  CLONE,
  CHANGE_BUTTON_TYPE,
  DELETE,
  DELETE_ALL,
  TOGGLE_NOTE,
  CHANGE_LABEL,
  SELECT_MIDI_DRIVER,
  SELECT_MIDI_DRIVER_INPUT,
  SELECT_CC,
  ADD_MIDI_CC_LISTENER,
  SET_MAX_VAL,
  SET_MIN_VAL,
  SET_ON_VAL,
  SET_OFF_VAL,
  SELECT_MIDI_CHANNEL,
  SELECT_MIDI_CHANNEL_INPUT,
  CHANGE_COLORS,
  CHANGE_FONT_SIZE,
  CHANGE_FONT_WEIGHT,
  TOGGLE_HIDE_VALUE
} = sliders

jest.mock('webmidi')

describe('Test sliders for slider-list', () => {
  test('INIT_FAILED', () => {
    const { isMidiFailed } = INIT_FAILED({}, { payload: {} })
    expect(isMidiFailed).toBe(true)
  })

  test('INIT_MIDI_ACCESS_OK', () => {
    const midiAccess = { someMidi: true }
    const { isMidiFailed, midi } = INIT_MIDI_ACCESS_OK(
      { isMidiFailed: true, midi: null },
      { payload: { midiAccess } }
    )
    expect(isMidiFailed).toBe(false)
    expect(midi.midiAccess).toBe(midiAccess)
  })

  // test('ADD_SLIDER', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_SLIDER(sliders, {})
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'SLIDER'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'SLIDER'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_SLIDER_HORZ', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_SLIDER_HORZ(sliders, {})
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'SLIDER_HORZ'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'SLIDER_HORZ'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_BUTTON', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_BUTTON(sliders, { payload: { type: 'BUTTON' } })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'BUTTON'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'BUTTON'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_BUTTON_TOGGLE', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_BUTTON(sliders, {
  //     payload: { type: 'BUTTON_TOGGLE' }
  //   })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'BUTTON_TOGGLE'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'BUTTON_TOGGLE'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_BUTTON_CC', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_BUTTON(sliders, {
  //     payload: { type: 'BUTTON_CC' }
  //   })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'BUTTON_CC'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_BUTTON_TOGGLE_CC', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_BUTTON(sliders, {
  //     payload: { type: 'BUTTON_TOGGLE_CC' }
  //   })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'BUTTON_TOGGLE_CC'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'BUTTON_TOGGLE_CC'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_LABEL', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_LABEL(sliders, { payload: {} })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'LABEL'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'LABEL'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_PAGE', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_PAGE(sliders, { payload: {} })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'PAGE'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'PAGE'
  //   expect(isLastElementSlider).toBe(true)
  // })

  // test('ADD_XYPAD', () => {
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList }
  //   } = mockStore
  //   const { sliderList } = ADD_XYPAD(sliders, { payload: {} })
  //   const isNewListLonger = sliderList.length > oldSliderList.length
  //   expect(isNewListLonger).toBe(true)
  //   const isOldLastElementNoSlider =
  //     oldSliderList[oldSliderList.length - 1].type !== 'XYPAD'
  //   expect(isOldLastElementNoSlider).toBe(true)
  //   const isLastElementSlider =
  //     sliderList[sliderList.length - 1].type === 'XYPAD'
  //   expect(isLastElementSlider).toBe(true)
  // })

  test('CLONE', () => {
    const { sliders } = mockStore

    const {
      i,
      label,
      type,
      driverName,
      driverNameInput,
      colors
    } = sliders.sliderList.find((item) => item.type === 'PAGE')
    const { sliderList } = CLONE(sliders, {
      payload: { i }
    })
    const elem = sliderList.find((el) => el.label === label)
    expect(type).toBe(elem.type)
    expect(driverName).toBe(elem.driverName)
    expect(driverNameInput).toBe(elem.driverNameInput)
    expect(colors.color).toBe(elem.colors.color)
    expect(colors.colorActive).toBe(elem.colors.colorActive)
    expect(colors.colorFont).toBe(elem.colors.colorFont)
  })

  test('CHANGE_BUTTON_TYPE', () => {
    const { sliders } = mockStore
    const expectedType = 'BUTTON_TOGGLE'
    const { type: oldType, i } = sliders.sliderList.find(
      (el) => el.type === 'BUTTON'
    )

    const { sliderList } = CHANGE_BUTTON_TYPE(sliders, {
      payload: { i, val: expectedType }
    })
    const elemr = sliderList.find((el) => el.i === i)
    expect(oldType).toBe('BUTTON')
    expect(elemr.type).toBe(expectedType)
  })

  test('DELETE', () => {
    const { sliders } = mockStore
    const oldElem = sliders.sliderList.find((el) => el.type === 'BUTTON')

    const { sliderList, sliderListBackup } = DELETE(sliders, {
      payload: { i: oldElem.i }
    })
    const elem = sliderList.find((el) => el.i === oldElem.i)
    expect(oldElem).toBeTruthy()
    expect(elem).toStrictEqual(undefined)
    expect(sliderListBackup).toStrictEqual(sliders.sliderList)
  })

  test('DELETE_ALL', () => {
    const { sliders } = mockStore
    const oldElem = sliders.sliderList.find((el) => el.type === 'BUTTON')

    const { sliderList, sliderListBackup } = DELETE_ALL(sliders, {
      payload: { i: oldElem.i }
    })
    const elem = sliderList.find((el) => el.i === oldElem.i)
    expect(oldElem).toBeTruthy()
    expect(sliderList.length).toBe(0)
    expect(elem).toBe(undefined)
    expect(sliderListBackup).toStrictEqual(sliders.sliderList)
  })

  test.skip('HANDLE_SLIDER_CHANGE', () => {
    const { sliders } = mockStore
    const expectedValue = '73'
    let idx = sliders.sliderList.findIndex((item) => item.type === 'SLIDER')
    const { val: oldVal } = sliders.sliderList[idx]

    const { sliderList } = HANDLE_SLIDER_CHANGE(sliders, {
      payload: { i: sliders.sliderList[idx].i, val: expectedValue }
    })
    const { val } = sliderList[idx]
    expect(oldVal !== expectedValue).toBe(true)
    expect(val).toBe(expectedValue)
  })

  test.skip('TOGGLE_NOTE', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'BUTTON_TOGGLE')
    const { isNoteOn: oldisNoteOn } = oldSliderList[idx]

    const { sliderList } = TOGGLE_NOTE(sliders, { payload: idx })
    const { isNoteOn } = sliderList[idx]
    expect(oldisNoteOn !== isNoteOn).toBe(true)
  })

  test.skip('CHANGE_LABEL', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'PAGE')
    const { label: oldLabel } = oldSliderList[idx]
    const expLabel = 'tim is cool'
    const { sliderList } = CHANGE_LABEL(sliders, {
      payload: { idx, val: expLabel }
    })
    const { label } = sliderList[idx]
    expect(oldLabel !== label).toBe(true)
    expect(expLabel).toEqual(label)
  })

  test.skip('SELECT_MIDI_DRIVER', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'SLIDER')
    const { driverName: oldDriverName, i } = oldSliderList[idx]
    const expLabel = 'midi-iac IAC Bus 2'
    const { sliderList } = SELECT_MIDI_DRIVER(sliders, {
      payload: { i, driverName: expLabel }
    })
    const { driverName } = sliderList[idx]

    expect(oldDriverName !== driverName).toBe(true)
    expect(expLabel).toEqual(driverName)
  })

  test.skip('SELECT_MIDI_DRIVER_INPUT', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'SLIDER')
    const { driverNameInput: olddriverNameInput, i } = oldSliderList[idx]
    const expLabel = 'midi-iac IAC Bus 2'
    const { sliderList } = SELECT_MIDI_DRIVER_INPUT(sliders, {
      payload: { i, driverNameInput: expLabel }
    })
    const { driverNameInput } = sliderList[idx]

    expect(olddriverNameInput !== driverNameInput).toBe(true)
    expect(expLabel).toEqual(driverNameInput)
  })

  test.skip('SELECT_CC', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'SLIDER')
    const { midiCC: oldmidiCC } = oldSliderList[idx]
    const expLabel = ['C1', 63]
    const { sliderList } = SELECT_CC(sliders, {
      payload: { idx, val: expLabel }
    })
    const { midiCC } = sliderList[idx]
    expect(oldmidiCC !== midiCC).toBe(true)
    expect(expLabel).toEqual(midiCC)
  })

  test.skip('ADD_MIDI_CC_LISTENER', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'SLIDER')
    const { listenToCc: oldlistenToCc } = oldSliderList[idx]
    const expLabel = ['C1', 63]
    const { sliderList } = ADD_MIDI_CC_LISTENER(sliders, {
      payload: { idx, val: expLabel }
    })
    const { listenToCc } = sliderList[idx]
    expect(oldlistenToCc !== listenToCc).toBe(true)
    expect(expLabel).toEqual(listenToCc)
  })

  test.skip('SET_MAX_VAL', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'SLIDER')
    const { maxVal: oldmaxVal } = oldSliderList[idx]
    const expLabel = 111
    const { sliderList } = SET_MAX_VAL(sliders, {
      payload: { idx, val: expLabel }
    })
    const { maxVal } = sliderList[idx]
    expect(oldmaxVal !== maxVal).toBe(true)
    expect(expLabel).toEqual(maxVal)
  })

  test.skip('SET_MIN_VAL', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'SLIDER')
    const { minVal: oldminVal } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SET_MIN_VAL(sliders, {
      payload: { idx, val: expLabel }
    })
    const { minVal } = sliderList[idx]
    expect(oldminVal !== minVal).toBe(true)
    expect(expLabel).toEqual(minVal)
  })

  test.skip('SET_ON_VAL', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'BUTTON')
    const { onVal: oldonVal } = oldSliderList[idx]
    const expLabel = 122
    const { sliderList } = SET_ON_VAL(sliders, {
      payload: { idx, val: expLabel }
    })
    const { onVal } = sliderList[idx]
    expect(oldonVal !== onVal).toBe(true)
    expect(expLabel).toEqual(onVal)
  })

  test.skip('SET_OFF_VAL', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'BUTTON')
    const { offVal: oldoffVal } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SET_OFF_VAL(sliders, {
      payload: { idx, val: expLabel }
    })
    const { offVal } = sliderList[idx]
    expect(oldoffVal !== offVal).toBe(true)
    expect(expLabel).toEqual(offVal)
  })

  test.skip('SELECT_MIDI_CHANNEL', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'BUTTON')
    const { midiChannel: oldmidiChannel } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SELECT_MIDI_CHANNEL(sliders, {
      payload: { idx, val: expLabel }
    })
    const { midiChannel } = sliderList[idx]
    expect(oldmidiChannel !== midiChannel).toBe(true)
    expect(expLabel).toEqual(midiChannel)
  })

  test.skip('SELECT_MIDI_CHANNEL_INPUT', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore

    const idx = oldSliderList.findIndex((item) => item.type === 'BUTTON')
    const { midiChannelInput: oldmidiChannelInput } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SELECT_MIDI_CHANNEL_INPUT(sliders, {
      payload: { idx, val: expLabel }
    })
    const { midiChannelInput } = sliderList[idx]
    expect(oldmidiChannelInput !== midiChannelInput).toBe(true)
    expect(expLabel).toEqual(midiChannelInput)
  })

  test('CHANGE_COLORS', () => {
    const {
      sliders,
      sliders: { sliderList: oldSliderList }
    } = mockStore
    const expVal = 'rgba(133, 66, 74, 1)'
    const idx = oldSliderList.findIndex((item) => item.type === 'BUTTON')
    const { colors: oldcolors, i } = oldSliderList[idx]
    const { sliderList } = CHANGE_COLORS(sliders, {
      payload: { i, color: expVal }
    })
    const { colors } = sliderList[idx]
    expect(oldcolors.color !== colors.color).toBe(true)
    expect(expVal).toEqual(colors.color)
  })

  test('CHANGE_FONT_SIZE', () => {
    const { sliders } = mockStore
    const expectedFontSize = 8
    const idx = sliders.sliderList.findIndex((item) => item.type === 'PAGE')
    const { fontSize: oldFontSize, i } = sliders.sliderList[idx]

    const { sliderList } = CHANGE_FONT_SIZE(sliders, {
      payload: { i, fontSize: expectedFontSize }
    })
    const { fontSize } = sliderList[idx]
    expect(oldFontSize).toBe(16)
    expect(fontSize).toBe(expectedFontSize)
  })

  test('CHANGE_FONT_WEIGHT', () => {
    const { sliders } = mockStore
    const expectedfontWeight = 400
    const idx = sliders.sliderList.findIndex((item) => item.type === 'PAGE')
    const { fontWeight: oldfontWeight, i } = sliders.sliderList[idx]

    const { sliderList } = CHANGE_FONT_WEIGHT(sliders, {
      payload: { i, fontWeight: expectedfontWeight }
    })
    const { fontWeight } = sliderList[idx]
    expect(oldfontWeight !== fontWeight).toBe(true)
    expect(fontWeight).toBe(expectedfontWeight)
  })

  test('TOGGLE_HIDE_VALUE', () => {
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex((item) => item.type === 'SLIDER')
    const { isValueHidden: oldisValueHidden, i } = sliders.sliderList[idx]

    const { sliderList } = TOGGLE_HIDE_VALUE(sliders, {
      payload: { i }
    })
    const { isValueHidden } = sliderList[idx]
    expect(oldisValueHidden !== isValueHidden).toBe(true)
    expect(oldisValueHidden).toBe(!isValueHidden)
  })

  test('RESET_VALUES', () => {
    const { sliders } = mockStore
    const expectedValue = 69
    const idx = sliders.sliderList.findIndex((item) => item.type === 'SLIDER')
    const { val: oldVal } = sliders.sliderList[idx]

    const { sliderList: changedSliderList } = HANDLE_SLIDER_CHANGE(sliders, {
      payload: { idx, val: expectedValue }
    })
    expect(oldVal !== changedSliderList[idx].val)

    const { sliderList } = RESET_VALUES(sliders, {
      payload: {}
    })

    expect(oldVal === sliderList[idx].val).toBe(true)
  })

  // test('GO_BACK', () => {
  //   const { GO_BACK } = sliders
  //   const { sliders } = mockStore

  //   const changedStore = {
  //     sliders: {
  //       ...sliders,
  //       sliderListBackup: mockSliderListBackup,
  //     },
  //   }
  //   const idx = mockSliderListBackup.findIndex(item => item.label === 'me too')
  //   const { x: oldX } = mockSliderListBackup[idx]
  //   const { sliderList } = GO_BACK(changedStore.sliders, {
  //     payload: {},
  //   })
  //   expect(oldX === sliderList[idx].x).toBe(true)
  // })

  // test('UPDATE_SLIDER_LIST_BACKUP', () => {
  //   const { UPDATE_SLIDER_LIST_BACKUP } = sliders
  //   const { sliders } = mockStore

  //   const changedStore = {
  //     sliders: {
  //       ...sliders,
  //       sliderListBackup: mockSliderListBackup,
  //     },
  //   }
  //   const idx = mockSliderListBackup.findIndex(item => item.label === 'me too')
  //   const { sliderListBackup } = UPDATE_SLIDER_LIST_BACKUP(
  //     changedStore.sliders,
  //     {
  //       payload: {},
  //     }
  //   )
  //   expect(sliders.sliderList[idx]).toEqual(sliderListBackup[idx])
  // })

  // test('EXTRACT_PAGE', () => {
  //   const { EXTRACT_PAGE } = sliders
  //   const {
  //     sliders,
  //     sliders: { sliderList: oldSliderList },
  //   } = mockStore

  //   // Create expected list
  //   const idx = oldSliderList.findIndex(item => item.type === 'PAGE')
  //   const { label } = oldSliderList[idx]

  //   const endIdx =
  //     oldSliderList
  //       .map((cur, idx) => {
  //         if (idx > 0) {
  //           return cur
  //         }
  //         return undefined
  //       })
  //       .filter(Boolean)
  //       .findIndex(cur => cur.type === 'PAGE') + 1

  //   let expectedList = oldSliderList.map(item => item).splice(idx, endIdx)
  //   const { sliderList } = EXTRACT_PAGE(sliders, {
  //     payload: { label },
  //   })
  //   expect(sliderList.length < oldSliderList.length).toBe(true)
  //   expect(sliderList.length === expectedList.length).toBe(true)
  //   expect(sliderList).toEqual(expectedList)
  // })

  test('MIDI_MESSAGE_ARRIVED with right driver, cc and channel', () => {
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex((item) => item.label === 'me too')
    const { val: oldVal, isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '60',
        channel: '3',
        driver: 'midi-iac IAC Bus 1',
        isNoteOn: true
      }
    })
    const { val, isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(!isNoteOn)
    expect(oldVal !== val).toBe(true)
  })

  test('MIDI_MESSAGE_ARRIVED with wrong driver', () => {
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex((item) => item.label === 'me too')
    const { isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '60',
        channel: '3',
        driver: 'midi-iac IAC Bus 2',
        isNoteOn: true
      }
    })
    const { isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(isNoteOn)
  })

  test('MIDI_MESSAGE_ARRIVED with wrong cc', () => {
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex((item) => item.label === 'me too')
    const { isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '61',
        channel: '3',
        driver: 'midi-iac IAC Bus 1',
        isNoteOn: true
      }
    })
    const { isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(isNoteOn)
  })

  test('MIDI_MESSAGE_ARRIVED with wrong channel', () => {
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex((item) => item.label === 'me too')
    const { isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '60',
        channel: '2',
        driver: 'midi-iac IAC Bus 1',
        isNoteOn: true
      }
    })
    const { isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(isNoteOn)
  })
})
