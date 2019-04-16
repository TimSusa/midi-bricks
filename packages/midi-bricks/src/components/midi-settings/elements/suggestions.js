export function suggestionsMidiNoteCC() {
  return Array.apply(null, { length: 128 })
    .map(Number.call, Number)
    .map((item) => {
      return {
        label: `${item}`
      }
    })
}

export function suggestionsMidiCc() {
  return Array.apply(null, { length: 120 })
    .map(Number.call, Number)
    .map((item) => {
      return { label: `${item}` }
    })
}