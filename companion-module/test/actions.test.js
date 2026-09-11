'use strict'

const assert = require('assert').strict
const updateActions = require('../src/actions')

const sent = []
let definitions = null

const self = {
  config: { cameraId: 1 },
  setActionDefinitions(value) {
    definitions = value
  },
  async sendVisca(buffer) {
    sent.push(buffer.toString('hex').toUpperCase())
  },
}

updateActions(self)

const expectedActions = [
  'pan_tilt',
  'home',
  'zoom',
  'focus',
  'autofocus',
  'preset',
  'exposure_mode',
  'iris',
  'white_balance',
  'backlight',
  'tally_red',
  'tally_green',
]

assert.deepEqual(Object.keys(definitions), expectedActions)

async function run() {
  await definitions.pan_tilt.callback({ options: { direction: 'left', panSpeed: 10, tiltSpeed: 8 } })
  await definitions.zoom.callback({ options: { direction: 'tele', speed: 4 } })
  await definitions.focus.callback({ options: { direction: 'near', speed: 3 } })
  await definitions.autofocus.callback({ options: { state: 'off' } })
  await definitions.preset.callback({ options: { operation: 'recall', number: 12 } })
  await definitions.exposure_mode.callback({ options: { mode: 'manual' } })
  await definitions.iris.callback({ options: { operation: 'down' } })
  await definitions.white_balance.callback({ options: { mode: 'k6500' } })
  await definitions.backlight.callback({ options: { state: 'on' } })
  await definitions.tally_red.callback({ options: { state: 'on' } })
  await definitions.tally_green.callback({ options: { state: 'off' } })
  await definitions.home.callback({ options: {} })

  assert.deepEqual(sent, [
    '810106010A080103FF',
    '8101040724FF',
    '8101040833FF',
    '8101043803FF',
    '8101043F020CFF',
    '8101043903FF',
    '8101040B03FF',
    '8101043506FF',
    '8101043302FF',
    '81017E010A0001FF',
    '81017E010A0004FF',
    '81010604FF',
  ])

  console.log(`${expectedActions.length} Companion actions registered; ${sent.length} callbacks verified`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
