export function createActionTypes(typeArray) {
  let typeObject = {}
  typeArray.forEach(item => {
    typeObject = {
      ...typeObject,
      [item]: item,
    }
  })
  return typeObject
}
