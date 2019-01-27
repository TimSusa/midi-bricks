const assert = require('assert')

const path = require('path')
const base = path.join(__dirname, '..')
const helpers = require('./setup')
// const electronPath = require('electron') //[base, '/dist/mac/midi-bricks-electron.app/Contents/MacOS/midi-bricks-electron'].join('/')

describe('Application launch', function() {
  helpers.setupTimeout(this)

  let app = null

  beforeEach(function() {
    return helpers
      .startApplication({
        args: [base, base + '/public', base + '/public/electron.js'],
      })
      .then(function(startedApp) {
        app = startedApp
      })
  })

  afterEach(function() {
    return helpers.stopApplication(app)
  })

  // it('opens a window', function() {
  //   return app.client
  //     .waitUntilWindowLoaded()
  //     .browserWindow.focus()
  //     .getWindowCount()
  //     .should.eventually.equal(2)
  //     .browserWindow.isMinimized()
  //     .should.eventually.be.false //.browserWindow.isDevToolsOpened().should.eventually.be.false
  //     .browserWindow.isVisible()
  //     .should.eventually.be.true //.browserWindow.isFocused().should.eventually.be.true
  //     .browserWindow.getBounds()
  //     .should.eventually.have.property('width')
  //     .and.be.above(0)
  //     .browserWindow.getBounds()
  //     .should.eventually.have.property('height')
  //     .and.be.above(0)
  // })

  it('Page Title should be MIDI Bricks', async function() {
    const title = await app.client
      .waitUntilWindowLoaded()
      .browserWindow.focus()
      .getWindowCount()
      .should.eventually.equal(2)
      .windowByIndex(0)
      .browserWindow.getBounds()
      .should.eventually.roughly(5)
      .deep.equal({
        height: 800,
        width: 1000,
        x: 0,
        y: 23,
      })
      .browserWindow.getTitle()

    assert.equal(title, 'MIDI Bricks')
    return app
  })
})

function logAll(client) {
  client.getMainProcessLogs().then(function(logs) {
    logs.forEach(function(log) {
      console.log(log)
    })
  })
  client.getRenderProcessLogs().then(function(logs) {
    logs.forEach(function(log) {
      console.log(log.message)
      console.log(log.source)
      console.log(log.level)
    })
  })
}
