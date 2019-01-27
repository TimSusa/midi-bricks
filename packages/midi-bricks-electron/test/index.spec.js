const assert = require("assert");

const path = require("path");
const base = path.join(__dirname, "..");
const helpers = require("./setup");

describe("Application launch", function() {
  helpers.setupTimeout(this);

  var app = null;

  beforeEach(function() {
    console.log("start");
    return helpers
      .startApplication({
        args: [base, base + "/public", base + "/public/electon.js"]
      })
      .then(function(startedApp) {
        app = startedApp;
      });
  });

  afterEach(function() {
    console.log("stop");
    return helpers.stopApplication(app);
  });

  it("opens a window", function() {
    return app.client
      .waitUntilWindowLoaded()
      .browserWindow.focus()
      .getWindowCount()
      .should.eventually.equal(2)
      .browserWindow.isMinimized()
      .should.eventually.be.false //.browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible()
      .should.eventually.be.true //.browserWindow.isFocused().should.eventually.be.true
      .browserWindow.getBounds()
      .should.eventually.have.property("width")
      .and.be.above(0)
      .browserWindow.getBounds()
      .should.eventually.have.property("height")
      .and.be.above(0);
  });

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
        .browserWindow.getTitle();

      assert.equal(title, "MIDI Bricks");
    } catch (e) {
      console.error(e);
      assert(e);
    }
    return app;
  });

  it('Live Button Switch: See if Menu App Bar is visible, find Footer Live Button and Press, look if MenuBar is not visible', async function() {
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
        y: 23,
      })
      .element('body')
      .element('h6*=MIDI Bricks')
      .isVisible()
      .getText('h6*=MIDI Bricks')
      .should.eventually.equal('MIDI Bricks')
      .element('button*=Live')
      .click()
      // .waitUntilWindowLoaded()
      // .element('h6*=MIDI Bricks')
      // .should.eventually.roughly({type: 'NoSuchElement'})
      // .element('button*=Live')
      // .click()
      // .element('button*=Live')
      // .click()
    return app
  })

  it('Change to layout mode', async function() {
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
        y: 23,
      })
      .element('body')
      .element('button svg[title="View Settings"]')
      .click()
      .element('span*=Layout - l')
      .click()
  
    return app
  })

  it('Open Drawer Menu Left', async function() {
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
        y: 23,
      })
      .element('body')
      .element('button[aria-label="Menu"]')
      .click()
      //.element('span*=Load Preset')
      //.isVisible()
      //.click()

    return app
  })
});

function logAll(client) {
  client.getMainProcessLogs().then(function(logs) {
    logs.forEach(function(log) {
      console.log(log);
    });
  });
  client.getRenderProcessLogs().then(function(logs) {
    logs.forEach(function(log) {
      console.log(log.message);
      console.log(log.source);
      console.log(log.level);
    });
  });
}
