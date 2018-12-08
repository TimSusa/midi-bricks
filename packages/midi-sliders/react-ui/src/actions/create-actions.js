export function createActions(actionObject) {
  let arr = Object.keys(actionObject).map(item => {
    return {
      [camelize(item)](payload) {
        return {
          type: actionObject[item],
          payload,
        }
      },
    }
  })
  let tmp = {}
  arr.forEach(item => {
    tmp = Object.assign({}, tmp, item)
  })
  return tmp
}

function camelize(str) {
  const me = str
    .toLowerCase()
    .split('_')
    .join(' ')
  return me.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}
