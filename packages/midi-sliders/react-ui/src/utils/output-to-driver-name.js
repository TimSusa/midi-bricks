export const outputToDriverName = ({ inputs, outputs }, driverNameInput, driverName) => {
  let driverNameInputOut = ''
  let driverNameOut = ''

  if (inputs && driverNameInput) {
    inputs.forEach((item) => {
      if (item.name === driverNameInput) {
        driverNameInputOut = driverNameInput
      }
    })
  }
  if (outputs && driverName) {
    outputs.forEach((item) => {
      if (item.name === driverName) {
        driverNameOut = item.name
      }
    })
  }
  if ([driverNameInput].includes('None')) {
    driverNameInputOut = 'None'
  }
  if ([driverName].includes('None')) {
    driverNameOut = 'None'
  }
  return { driverName: driverNameOut, driverNameInput: driverNameInputOut }
}
