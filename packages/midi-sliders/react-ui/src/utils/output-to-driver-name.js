export const outputIdToDriverName = (drivers, outputId, driverName) => {
  let name = ''
  let outputIdOut
  drivers.forEach((item) => {
    if (item.name === driverName) {
      name = item.name
    }
    if (item.outputId === outputId) {
      outputIdOut = outputId
    }
  })
  return { driverName: name, outputId: outputIdOut }
}
