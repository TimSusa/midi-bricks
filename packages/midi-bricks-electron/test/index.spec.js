const assert = require("assert")

const path = require("path")
const base = path.join(__dirname, "..")
const helpers = require("./setup")

describe("Application launch", function() {
  helpers.setupTimeout(this)

  var app = null

  beforeEach(function() {
    return helpers
      .startApplication({
        args: [base, base + "/public", base + "/public/electon.js"]
      })
      .then(function(startedApp) {
        app = startedApp
      })
  })

  afterEach(function() {
    return helpers.stopApplication(app)
  })

  it("Check for right window adjustment", function() {
    return app.client
      .waitUntilWindowLoaded()
      .browserWindow.focus()
      .getWindowCount()
      .should.eventually.equal(2)
      .browserWindow.isMinimized()
      .should.eventually.be.false.browserWindow.isDevToolsOpened()
      .should.eventually.be.true.browserWindow.isVisible()
      .should.eventually.be.true.browserWindow.isFocused()
      .should.eventually.be.true.browserWindow.getBounds()
      .should.eventually.have.property("width")
      .and.be.above(0)
      .browserWindow.getBounds()
      .should.eventually.have.property("height")
      .and.be.above(0)
  })

  it("Page Title should be MIDI Bricks", async function() {
    try {
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
          y: 23
        })
        .browserWindow.getTitle()

      assert.equal(title, "MIDI Bricks")
    } catch (e) {
      console.error(e)
      assert(e)
    }
    return app
  })

  it("Live Button Switch: See if Menu App Bar is visible.", async function() {
    const button = await app.client
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
        y: 23
      })
      .getText("h6*=MIDI Bricks")
      .should.eventually.equal("MIDI Bricks")
      .click("button*=Live")
      .element("h6*=MIDI Bricks")
      .should.eventually.roughly({ type: "NoSuchElement" })
    return app
  })

  it("Change to layout mode", async function() {
    const button = await app.client
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
        y: 23
      })
      .click('button svg[title="View Settings"]')
      .click("span*=Layout - l")
      .moveToObject('button svg[title="Add Element"]')
      .pause(2000)
      //.click('button')
      //.click('button svg[title="Add Element"]')
      //.moveToObject('ul li')
      //.pause(6000)

    //console.log('isbsvsa ', button)
    // const me = await app.client
    //   .click('button svg[title="Add Element"]')

    return app
  })

  it("Open Drawer Menu Left", async function() {
    const button = await app.client
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
        y: 23
      })
      .click('button[aria-label="Menu"]')
    //.element('span*=Load Preset')
    //.isVisible()

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
