
import { Note } from 'tonal'

export const fromMidi = (num, sharps = true) => {
  const SHARPS = Note.names(' #')
  const FLATS = Note.names(' b')
  num = Math.round(num)
  const pcs = sharps === true ? SHARPS : FLATS
  const pc = pcs[num % 12]
  const o = Math.floor(num / 12) - 2
  return pc + o
}
