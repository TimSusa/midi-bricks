import { reducers } from '../slider-list'
import { mockStore, mockSliderListBackup } from './mock-store'

jest.mock('webmidi')

describe('Test Reducers for slider-list', () => {
  test('INIT_FAILED', () => {
    const { INIT_FAILED } = reducers
    const { isMidiFailed } = INIT_FAILED({}, { payload: {} })
    expect(isMidiFailed).toBe(true)
  })

  test('INIT_MIDI_ACCESS', () => {
    const { INIT_MIDI_ACCESS } = reducers
    const midiAccess = { someMidi: true }
    const { isMidiFailed, midi } = INIT_MIDI_ACCESS(
      { isMidiFailed: true, midi: null },
      { payload: { midiAccess } }
    )
    expect(isMidiFailed).toBe(false)
    expect(midi.midiAccess).toBe(midiAccess)
  })

  test('ADD_SLIDER', () => {
    const { ADD_SLIDER } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_SLIDER(sliders, {})
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'SLIDER'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'SLIDER'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_SLIDER_HORZ', () => {
    const { ADD_SLIDER_HORZ } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_SLIDER_HORZ(sliders, {})
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'SLIDER_HORZ'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'SLIDER_HORZ'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_BUTTON', () => {
    const { ADD_BUTTON } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_BUTTON(sliders, { payload: { type: 'BUTTON' } })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'BUTTON'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'BUTTON'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_BUTTON_TOGGLE', () => {
    const { ADD_BUTTON } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_BUTTON(sliders, {
      payload: { type: 'BUTTON_TOGGLE' },
    })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'BUTTON_TOGGLE'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'BUTTON_TOGGLE'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_BUTTON_CC', () => {
    const { ADD_BUTTON } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_BUTTON(sliders, {
      payload: { type: 'BUTTON_CC' },
    })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'BUTTON_CC'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_BUTTON_TOGGLE_CC', () => {
    const { ADD_BUTTON } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_BUTTON(sliders, {
      payload: { type: 'BUTTON_TOGGLE_CC' },
    })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'BUTTON_TOGGLE_CC'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'BUTTON_TOGGLE_CC'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_LABEL', () => {
    const { ADD_LABEL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_LABEL(sliders, { payload: {} })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'LABEL'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'LABEL'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_PAGE', () => {
    const { ADD_PAGE } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_PAGE(sliders, { payload: {} })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'PAGE'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'PAGE'
    expect(isLastElementSlider).toBe(true)
  })

  test('ADD_XYPAD', () => {
    const { ADD_XYPAD } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const { sliderList } = ADD_XYPAD(sliders, { payload: {} })
    const isNewListLonger = sliderList.length > oldSliderList.length
    expect(isNewListLonger).toBe(true)
    const isOldLastElementNoSlider =
      oldSliderList[oldSliderList.length - 1].type !== 'XYPAD'
    expect(isOldLastElementNoSlider).toBe(true)
    const isLastElementSlider =
      sliderList[sliderList.length - 1].type === 'XYPAD'
    expect(isLastElementSlider).toBe(true)
  })

  test('CLONE', () => {
    const { CLONE } = reducers
    const { sliders } = mockStore

    const {
      i,
      label,
      type,
      driverName,
      driverNameInput,
      colors,
    } = sliders.sliderList.find(item => item.type === 'PAGE')
    const { sliderList } = CLONE(sliders, {
      payload: { i },
    })
    const elem = sliderList.find(el => el.label === label)
    expect(type).toBe(elem.type)
    expect(driverName).toBe(elem.driverName)
    expect(driverNameInput).toBe(elem.driverNameInput)
    expect(colors.color).toBe(elem.colors.color)
    expect(colors.colorActive).toBe(elem.colors.colorActive)
    expect(colors.colorFont).toBe(elem.colors.colorFont)
  })

  test('CHANGE_BUTTON_TYPE', () => {
    const { CHANGE_BUTTON_TYPE } = reducers
    const { sliders } = mockStore
    const expectedType = 'BUTTON_TOGGLE'
    const { type: oldType, i } = sliders.sliderList.find(
      el => el.type === 'BUTTON'
    )

    const { sliderList } = CHANGE_BUTTON_TYPE(sliders, {
      payload: { i, val: expectedType },
    })
    const elemr = sliderList.find(el => el.i === i)
    expect(oldType).toBe('BUTTON')
    expect(elemr.type).toBe(expectedType)
  })

  test('DELETE', () => {
    const { DELETE } = reducers
    const { sliders } = mockStore
    const oldElem = sliders.sliderList.find(el => el.type === 'BUTTON')

    const { sliderList, sliderListBackup } = DELETE(sliders, {
      payload: { i: oldElem.i },
    })
    const elem = sliderList.find(el => el.i === oldElem.i)
    expect(oldElem).toBeTruthy()
    expect(elem).toBe(undefined)
    expect(sliderListBackup).toBe(sliders.sliderList)
  })

  test('DELETE_ALL', () => {
    const { DELETE_ALL } = reducers
    const { sliders } = mockStore
    const oldElem = sliders.sliderList.find(el => el.type === 'BUTTON')

    const { sliderList, sliderListBackup } = DELETE_ALL(sliders, {
      payload: { i: oldElem.i },
    })
    const elem = sliderList.find(el => el.i === oldElem.i)
    expect(oldElem).toBeTruthy()
    expect(sliderList.length).toBe(0)
    expect(elem).toBe(undefined)
    expect(sliderListBackup).toBe(sliders.sliderList)
  })

  test('HANDLE_SLIDER_CHANGE', () => {
    const { HANDLE_SLIDER_CHANGE } = reducers
    const { sliders } = mockStore
    const expectedValue = '111'
    let idx = sliders.sliderList.findIndex(item => item.type === 'SLIDER')
    const { val: oldVal } = sliders.sliderList[idx]

    const { sliderList } = HANDLE_SLIDER_CHANGE(sliders, {
      payload: { idx, val: expectedValue },
    })
    const { val } = sliderList[idx]
    expect(oldVal !== expectedValue).toBe(true)
    expect(val).toBe(expectedValue)
  })

  test('TOGGLE_NOTE', () => {
    const { TOGGLE_NOTE } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'BUTTON_TOGGLE')
    const { isNoteOn: oldisNoteOn } = oldSliderList[idx]

    const { sliderList } = TOGGLE_NOTE(sliders, { payload: idx })
    const { isNoteOn } = sliderList[idx]
    expect(oldisNoteOn !== isNoteOn).toBe(true)
  })

  test('CHANGE_LABEL', () => {
    const { CHANGE_LABEL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'PAGE')
    const { label: oldLabel } = oldSliderList[idx]
    const expLabel = 'tim is cool'
    const { sliderList } = CHANGE_LABEL(sliders, {
      payload: { idx, val: expLabel },
    })
    const { label } = sliderList[idx]
    expect(oldLabel !== label).toBe(true)
    expect(expLabel).toEqual(label)
  })

  test('SELECT_MIDI_DRIVER', () => {
    const { SELECT_MIDI_DRIVER } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'SLIDER')
    const { driverName: oldDriverName, i } = oldSliderList[idx]
    const expLabel = 'midi-iac IAC Bus 2'
    const { sliderList } = SELECT_MIDI_DRIVER(sliders, {
      payload: { i, driverName: expLabel },
    })
    const { driverName } = sliderList[idx]

    expect(oldDriverName !== driverName).toBe(true)
    expect(expLabel).toEqual(driverName)
  })

  test('SELECT_MIDI_DRIVER_INPUT', () => {
    const { SELECT_MIDI_DRIVER_INPUT } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'SLIDER')
    const { driverNameInput: olddriverNameInput, i } = oldSliderList[idx]
    const expLabel = 'midi-iac IAC Bus 2'
    const { sliderList } = SELECT_MIDI_DRIVER_INPUT(sliders, {
      payload: { i, driverNameInput: expLabel },
    })
    const { driverNameInput } = sliderList[idx]

    expect(olddriverNameInput !== driverNameInput).toBe(true)
    expect(expLabel).toEqual(driverNameInput)
  })

  test('SELECT_CC', () => {
    const { SELECT_CC } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'SLIDER')
    const { midiCC: oldmidiCC } = oldSliderList[idx]
    const expLabel = ['C1', 63]
    const { sliderList } = SELECT_CC(sliders, {
      payload: { idx, val: expLabel },
    })
    const { midiCC } = sliderList[idx]
    expect(oldmidiCC !== midiCC).toBe(true)
    expect(expLabel).toEqual(midiCC)
  })

  test('ADD_MIDI_CC_LISTENER', () => {
    const { ADD_MIDI_CC_LISTENER } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'SLIDER')
    const { listenToCc: oldlistenToCc } = oldSliderList[idx]
    const expLabel = ['C1', 63]
    const { sliderList } = ADD_MIDI_CC_LISTENER(sliders, {
      payload: { idx, val: expLabel },
    })
    const { listenToCc } = sliderList[idx]
    expect(oldlistenToCc !== listenToCc).toBe(true)
    expect(expLabel).toEqual(listenToCc)
  })

  test('SET_MAX_VAL', () => {
    const { SET_MAX_VAL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'SLIDER')
    const { maxVal: oldmaxVal } = oldSliderList[idx]
    const expLabel = 111
    const { sliderList } = SET_MAX_VAL(sliders, {
      payload: { idx, val: expLabel },
    })
    const { maxVal } = sliderList[idx]
    expect(oldmaxVal !== maxVal).toBe(true)
    expect(expLabel).toEqual(maxVal)
  })

  test('SET_MIN_VAL', () => {
    const { SET_MIN_VAL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'SLIDER')
    const { minVal: oldminVal } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SET_MIN_VAL(sliders, {
      payload: { idx, val: expLabel },
    })
    const { minVal } = sliderList[idx]
    expect(oldminVal !== minVal).toBe(true)
    expect(expLabel).toEqual(minVal)
  })

  test('SET_ON_VAL', () => {
    const { SET_ON_VAL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'BUTTON')
    const { onVal: oldonVal } = oldSliderList[idx]
    const expLabel = 122
    const { sliderList } = SET_ON_VAL(sliders, {
      payload: { idx, val: expLabel },
    })
    const { onVal } = sliderList[idx]
    expect(oldonVal !== onVal).toBe(true)
    expect(expLabel).toEqual(onVal)
  })

  test('SET_OFF_VAL', () => {
    const { SET_OFF_VAL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'BUTTON')
    const { offVal: oldoffVal } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SET_OFF_VAL(sliders, {
      payload: { idx, val: expLabel },
    })
    const { offVal } = sliderList[idx]
    expect(oldoffVal !== offVal).toBe(true)
    expect(expLabel).toEqual(offVal)
  })

  test('SELECT_MIDI_CHANNEL', () => {
    const { SELECT_MIDI_CHANNEL } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'BUTTON')
    const { midiChannel: oldmidiChannel } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SELECT_MIDI_CHANNEL(sliders, {
      payload: { idx, val: expLabel },
    })
    const { midiChannel } = sliderList[idx]
    expect(oldmidiChannel !== midiChannel).toBe(true)
    expect(expLabel).toEqual(midiChannel)
  })

  test('SELECT_MIDI_CHANNEL_INPUT', () => {
    const { SELECT_MIDI_CHANNEL_INPUT } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore

    const idx = oldSliderList.findIndex(item => item.type === 'BUTTON')
    const { midiChannelInput: oldmidiChannelInput } = oldSliderList[idx]
    const expLabel = 11
    const { sliderList } = SELECT_MIDI_CHANNEL_INPUT(sliders, {
      payload: { idx, val: expLabel },
    })
    const { midiChannelInput } = sliderList[idx]
    expect(oldmidiChannelInput !== midiChannelInput).toBe(true)
    expect(expLabel).toEqual(midiChannelInput)
  })

  test('CHANGE_COLORS', () => {
    const { CHANGE_COLORS } = reducers
    const {
      sliders,
      sliders: { sliderList: oldSliderList },
    } = mockStore
    const expVal = 'rgba(133, 66, 74, 1)'
    const idx = oldSliderList.findIndex(item => item.type === 'BUTTON')
    const { colors: oldcolors, i } = oldSliderList[idx]
    const { sliderList } = CHANGE_COLORS(sliders, {
      payload: { i, color: expVal },
    })
    const { colors } = sliderList[idx]
    expect(oldcolors.color !== colors.color).toBe(true)
    expect(expVal).toEqual(colors.color)
  })

  test('CHANGE_FONT_SIZE', () => {
    const { CHANGE_FONT_SIZE } = reducers
    const { sliders } = mockStore
    const expectedFontSize = 8
    const idx = sliders.sliderList.findIndex(item => item.type === 'PAGE')
    const { fontSize: oldFontSize, i } = sliders.sliderList[idx]

    const { sliderList } = CHANGE_FONT_SIZE(sliders, {
      payload: { i, fontSize: expectedFontSize },
    })
    const { fontSize } = sliderList[idx]
    expect(oldFontSize).toBe(16)
    expect(fontSize).toBe(expectedFontSize)
  })

  test('CHANGE_FONT_WEIGHT', () => {
    const { CHANGE_FONT_WEIGHT } = reducers
    const { sliders } = mockStore
    const expectedfontWeight = 400
    const idx = sliders.sliderList.findIndex(item => item.type === 'PAGE')
    const { fontWeight: oldfontWeight, i } = sliders.sliderList[idx]

    const { sliderList } = CHANGE_FONT_WEIGHT(sliders, {
      payload: { i, fontWeight: expectedfontWeight },
    })
    const { fontWeight } = sliderList[idx]
    expect(oldfontWeight !== fontWeight).toBe(true)
    expect(fontWeight).toBe(expectedfontWeight)
  })

  test('TOGGLE_HIDE_VALUE', () => {
    const { TOGGLE_HIDE_VALUE } = reducers
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex(item => item.type === 'SLIDER')
    const { isValueHidden: oldisValueHidden, i } = sliders.sliderList[idx]

    const { sliderList } = TOGGLE_HIDE_VALUE(sliders, {
      payload: { i },
    })
    const { isValueHidden } = sliderList[idx]
    expect(oldisValueHidden !== isValueHidden).toBe(true)
    expect(oldisValueHidden).toBe(!isValueHidden)
  })

  test('RESET_VALUES', () => {
    const { RESET_VALUES, HANDLE_SLIDER_CHANGE } = reducers
    const { sliders } = mockStore
    const expectedValue = 69
    const idx = sliders.sliderList.findIndex(item => item.type === 'SLIDER')
    const { val: oldVal } = sliders.sliderList[idx]

    const { sliderList: changedSliderList } = HANDLE_SLIDER_CHANGE(sliders, {
      payload: { idx, val: expectedValue },
    })
    expect(oldVal !== changedSliderList[idx].val)

    const { sliderList } = RESET_VALUES(sliders, {
      payload: {},
    })

    expect(oldVal === sliderList[idx].val).toBe(true)
  })

  test('GO_BACK', () => {
    const { GO_BACK } = reducers
    const { sliders } = mockStore

    const changedStore = {
      sliders: {
        ...sliders,
        sliderListBackup: mockSliderListBackup,
      },
    }
    const idx = mockSliderListBackup.findIndex(item => item.label === 'me too')
    const { x: oldX } = mockSliderListBackup[idx]
    const { sliderList } = GO_BACK(changedStore.sliders, {
      payload: {},
    })
    expect(oldX === sliderList[idx].x).toBe(true)
  })

  test('UPDATE_SLIDER_LIST_BACKUP', () => {
    const { UPDATE_SLIDER_LIST_BACKUP } = reducers
    const { sliders } = mockStore

    const changedStore = {
      sliders: {
        ...sliders,
        sliderListBackup: mockSliderListBackup,
      },
    }
    const idx = mockSliderListBackup.findIndex(item => item.label === 'me too')
    const { sliderListBackup } = UPDATE_SLIDER_LIST_BACKUP(
      changedStore.sliders,
      {
        payload: {},
      }
    )
    expect(sliders.sliderList[idx]).toEqual(sliderListBackup[idx])
  })

  // test('EXTRACT_PAGE', () => {
  //   const { EXTRACT_PAGE } = reducers
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
    const { MIDI_MESSAGE_ARRIVED } = reducers
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex(item => item.label === 'me too')
    const { val: oldVal, isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '60',
        channel: '3',
        driver: 'midi-iac IAC Bus 1',
        isNoteOn: true,
      },
    })
    const { val, isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(!isNoteOn)
    expect(oldVal !== val).toBe(true)
  })

  test('MIDI_MESSAGE_ARRIVED with wrong driver', () => {
    const { MIDI_MESSAGE_ARRIVED } = reducers
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex(item => item.label === 'me too')
    const { isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '60',
        channel: '3',
        driver: 'midi-iac IAC Bus 2',
        isNoteOn: true,
      },
    })
    const { isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(isNoteOn)
  })

  test('MIDI_MESSAGE_ARRIVED with wrong cc', () => {
    const { MIDI_MESSAGE_ARRIVED } = reducers
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex(item => item.label === 'me too')
    const { isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '61',
        channel: '3',
        driver: 'midi-iac IAC Bus 1',
        isNoteOn: true,
      },
    })
    const { isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(isNoteOn)
  })

  test('MIDI_MESSAGE_ARRIVED with wrong channel', () => {
    const { MIDI_MESSAGE_ARRIVED } = reducers
    const { sliders } = mockStore
    const idx = sliders.sliderList.findIndex(item => item.label === 'me too')
    const { isNoteOn: oldIdNoteOn } = sliders.sliderList[idx]

    const { sliderList } = MIDI_MESSAGE_ARRIVED(sliders, {
      payload: {
        val: 69,
        cC: '60',
        channel: '2',
        driver: 'midi-iac IAC Bus 1',
        isNoteOn: true,
      },
    })
    const { isNoteOn } = sliderList[idx]

    expect(oldIdNoteOn).toEqual(isNoteOn)
  })
})
