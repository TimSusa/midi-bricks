export const outputToDriverName = ({ inputs, outputs }, driverNameInput, driverName) => {
  let driverNameInputOut = ''
  let driverNameOut = ''

  if (inputs && driverNameInput) {
    inputs.forEach((item) => {
      if (item === driverNameInput) {
        driverNameInputOut = driverNameInput
      }
    })
  }
  if (outputs && driverName) {
    outputs.forEach((item) => {
      if (item === driverName) {
        driverNameOut = item
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
