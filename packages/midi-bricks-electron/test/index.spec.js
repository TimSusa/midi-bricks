//const Application = require('spectron').Application
const assert = require('assert')

const path = require('path')
const base = path.join(__dirname, '..')
const helpers = require('./setup')
const electronPath = require('electron')//[base, '/dist/mac/midi-bricks-electron.app/Contents/MacOS/midi-bricks-electron'].join('/')

describe('Application launch', function () {
  helpers.setupTimeout(this)

  var app = null

  beforeEach(function () {
    return helpers.startApplication({
      args: [base, base+'/public', base+'/public/electron.js']// [path.join(__dirname, 'public')]
    }).then(function (startedApp) { app = startedApp })
  })

  afterEach(function () {
    return helpers.stopApplication(app)
  })
  // this.timeout(10000)

  // beforeEach(function () {

  //   this.app = new Application({
  //     // Your electron path can be any binary
  //     // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  //     // But for the sake of the example we fetch it from our node_modules.
  //     path: electronPath,

  //     // Assuming you have the following directory structure

  //     //  |__ my project
  //     //     |__ ...
  //     //     |__ main.js
  //     //     |__ package.json
  //     //     |__ index.html
  //     //     |__ ...
  //     //     |__ test
  //     //        |__ spec.js  <- You are here! ~ Well you should be.

  //     // The following line tells spectron to look and use the main.js file
  //     // and the package.json located 1 level above.
  //     //args: [base]
  //     args: [base, base+'/public', base+'/public/electron.js']
  //   })
  //   console.log('app start')
  //   return this.app.start()
  // })

  // afterEach(function () {
  //   if (this.app && this.app.isRunning()) {
  //     console.log('app stop')
  //     return this.app.stop()
  //   }
  // })

  it('shows an initial window', function () {
    logAll(app.client)
    return app.client.getWindowCount().then(function (count) {
      //assert.equal(count, 1)
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      assert.equal(count, 2)
    })
  })

  it('opens a window', function () {
    return app.client.waitUntilWindowLoaded()
      .browserWindow.focus()
      .getWindowCount().should.eventually.equal(2)
      .browserWindow.isMinimized().should.eventually.be.false
      //.browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible().should.eventually.be.true
      //.browserWindow.isFocused().should.eventually.be.true
      .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
      .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
  })

  it("go to login view", function () {
    const tmp = app.client.element('body')
    console.log('tmp ', tmp)
    return tmp.click();
  })
})


function logAll(client) {
  client.getMainProcessLogs().then(function (logs) {
    logs.forEach(function (log) {
      console.log(log)
    })
  })
  client.getRenderProcessLogs().then(function (logs) {
    logs.forEach(function (log) {
      console.log(log.message)
      console.log(log.source)
      console.log(log.level)
    })
  })
}