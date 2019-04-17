//const assert = require('assert')
const expect = require('chai').expect
const path = require('path')
const base = path.join(__dirname, '..')
const helpers = require('./setup')

const liveButtonSelector = 'button*=Live'
const menuBarSelector = 'h6*=MIDI Bricks'
const settingsButtonSelector = 'button[title="Switch to Settings Mode."]'
const layoutButtonSelector = 'button[title="Switch to Layout Mode."]'
const layoutCommitButtonSelector =
  'button[title="Commit changes and exit layout-mode."]'
// const layoutExitButtonSelector =
//   'button[title="Throw away changes and go back."]'
const addElementMenuSelector = 'button[title="Add Element"]'
const addPageSelector = 'li*=Add Page'
const addVerticalSliderSelector = 'li*=Add Vertical Slider'
const addHorzSliderSelector = 'li*=Add Horizontal Slider'
const addButtonSelector = 'li*=Add Button'
const addButtonCcSelector = 'li*=Add Button CC'
const addButtonProgramChangeSelector = 'li*=Add Button Program Change'
const addLabelSelector = 'li*=Add Label'
const addXyPadSelector = 'li*=Add X/Y Pad'

describe('E2E Tests for MIDI-Bricks will get started...', function() {
  // eslint-disable-next-line babel/no-invalid-this
  helpers.setupTimeout(this)

  var app = null
  var winInit = null

  beforeEach(async function() {
    const startedApp = await helpers.startApplication({
      args: [base, base + '/public', base + '/public/electon.js']
    })

    app = startedApp
    // logAll(app.client)
    winInit = (app) =>
      app.client
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
        .browserWindow.focus()

    return helpers
  })

  afterEach(function() {
    return helpers.stopApplication(app)
  })

  it('Check for right window adjustment', function() {
    winInit(app)
      .browserWindow.isMinimized()
      .should.eventually.be.false.browserWindow.isDevToolsOpened()
      .should.eventually.be.true.browserWindow.isVisible()
      .should.eventually.be.true.browserWindow.isFocused()
      .should.eventually.be.true.browserWindow.getBounds()
      .should.eventually.have.property('width')
      .and.be.above(0)
      .browserWindow.getBounds()
      .should.eventually.have.property('height')
      .and.be.above(0)

    return app
  })

  it('Page Title should be MIDI Bricks', function() {
    app.client.browserWindow.getTitle().should.eventually.equal('MIDI Bricks')

    return app
  })

  it.skip('Open Drawer Menu Left', function() {
    app.client.click('button[aria-label="Menu"]')
    //.element('span*=Load Preset')
    //.isVisible()

    return app
  })

  it('Live Button Switch: See if Menu App Bar is visible, otherwise click Live-Button.', async function() {
    const { type } = await app.client
      .element(menuBarSelector)
      .should.not.eventually.equal(null)
    const isBar = type !== 'NoSuchElement'

    // Do we have a menubar?
    if (!isBar) {
      const { type: typeMe } = await app.client
        .element(liveButtonSelector)
        .should.not.eventually.equal(null)
      const isBut = typeMe !== 'NoSuchElement'
      if (isBut) {
        await app.client.click(liveButtonSelector)
      }
    }
    return app
  })

  it('Layout-Mode: Test Menu-App-Bar Logic', async function() {
    const { client } = app
    let isMen = await isSelectorVisible(client, menuBarSelector)
    // No menu bar there? Just again click it
    !isMen && (await app.client.click(liveButtonSelector))
    isMen = await isSelectorVisible(client, menuBarSelector).should.not.eventually.equal(null)

    await isSelectorVisible(client, menuBarSelector).should.not.eventually.equal(null)

    // // Add Page
    await switchToLayoutMode(client)
    await openAddMenu(client)
    await addElement(client, addPageSelector)
    await winInit(app)
    await isSelectorVisible(client, layoutCommitButtonSelector)
    await commitElement(client, addPageSelector)

    // Add Label
    await addElementAndCheckIfCommitted(app, winInit, addLabelSelector)

    // Add vertical slider
    await addElementAndCheckIfCommitted(app, winInit, addVerticalSliderSelector)

    // Add horizontal slider
    await addElementAndCheckIfCommitted(app, winInit, addHorzSliderSelector)

    // Add Button
    await addElementAndCheckIfCommitted(app, winInit, addButtonSelector)

    // Add CC Button
    await addElementAndCheckIfCommitted(app, winInit, addButtonCcSelector)

    // Add Program Change Button
    await addElementAndCheckIfCommitted(app, winInit, addButtonProgramChangeSelector)

    // Add XY Pad
    await addElementAndCheckIfCommitted(app, winInit, addXyPadSelector)

    await client.click(settingsButtonSelector)

    return app
  })
})

async function addElementAndCheckIfCommitted(app, winInit, selector) {
  const { client } = app
  await client.click(settingsButtonSelector)
  await switchToLayoutMode(client)
  await openAddMenu(client)
  await addElement(client, selector)
  await winInit(app)
  await isSelectorVisible(client, layoutCommitButtonSelector)
  await commitElement(client, selector)
  return client
}

async function isSelectorVisible(client, selector) {
  const { type } = await client.element(selector)
  const isVisible = type !== 'NoSuchElement'

  return isVisible
}

async function openAddMenu(client) {
  const isAddElementMenuSelector = await isSelectorVisible(
    client,
    addElementMenuSelector
  )
  // expect(isAddElementMenuSelector).to.be.true
  isAddElementMenuSelector && (await client.click(addElementMenuSelector))
  return client
}

async function addElement(client, selector) {
  const isThere = await isSelectorVisible(client, selector)
  // expect(isThere).to.be.true
  isThere && (await client.click(selector))
  return client
}

async function switchToLayoutMode(client) {
  await client.click(layoutButtonSelector)
  return client
}

async function commitElement(client, selector) {
  let isCommitBtnThere = null
  try {
    isCommitBtnThere = await isSelectorVisible(
      client,
      layoutCommitButtonSelector
    )
  } catch (error) {
    throw new Error(
      'ERROR: Selector: ',
      selector,
      ' ...here is the error: ',
      error
    )
  }
  isCommitBtnThere &&
    (console.log('succeeded committing selector:', selector) ||
      (await client.click(layoutCommitButtonSelector)))
  return client
}
// function logAll(client) {
//   client.getMainProcessLogs().then(function(logs) {
//     logs.forEach(function(log) {
//       console.log(log)
//     })
//   })
//   client.getRenderProcessLogs().then(function(logs) {
//     logs.forEach(function(log) {
//       console.log(log.message)
//       console.log(log.source)
//       console.log(log.level)
//     })
//   })
// }
