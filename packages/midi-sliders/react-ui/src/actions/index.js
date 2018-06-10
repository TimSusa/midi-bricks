import * as TodoActions from './todo'
import * as RackActions from './rack'
import * as MidiSliderActions from './midi-sliders'
import * as MidiAccessActions from './midi-access'

export const ActionCreators = Object.assign({}, TodoActions, RackActions, MidiAccessActions, MidiSliderActions)
