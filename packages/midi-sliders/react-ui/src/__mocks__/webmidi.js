// __mocks__/webmidi.js


const webmidi = jest.genMockFromModule('webmidi')

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function getOutputByName(driverName) {
  return null
}

webmidi.readdirSync = getOutputByName

module.exports = webmidi
