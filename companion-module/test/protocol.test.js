'use strict'

const assert = require('assert').strict
const { Commands } = require('../src/protocol')

const hex = (buffer) => buffer.toString('hex').toUpperCase()

const cases = [
  [Commands.home(1), '81010604FF'],
  [Commands.panTilt('up', 14, 14, 1), '810106010E0E0301FF'],
  [Commands.panTilt('stop', 24, 20, 1), '8101060118140303FF'],
  [Commands.zoomTele(2, 1), '8101040722FF'],
  [Commands.zoomWide(15, 1), '810104073FFF'],
  [Commands.focusNear(3, 1), '8101040833FF'],
  [Commands.autofocus(true, 1), '8101043802FF'],
  [Commands.presetSet(5, 1), '8101043F0105FF'],
  [Commands.presetRecall(5, 1), '8101043F0205FF'],
  [Commands.exposureMode('iris', 1), '810104390BFF'],
  [Commands.iris('up', 1), '8101040B02FF'],
  [Commands.whiteBalance('onePush', 1), '8101043503FF'],
  [Commands.backlight(true, 1), '8101043302FF'],
  [Commands.tallyRed(true), '81017E010A0001FF'],
  [Commands.tallyGreen(true), '81017E010A0003FF'],
]

for (const [actual, expected] of cases) {
  assert.equal(hex(actual), expected)
}

assert.throws(() => Commands.panTilt('invalid', 8, 8, 1), /unknown direction/)
assert.throws(() => Commands.whiteBalance('invalid', 1), /unknown white balance mode/)
for (const invalid of [NaN, Infinity, 1.5, '', null, 'abc']) {
  assert.throws(() => Commands.zoomTele(invalid), /expected an integer/)
  assert.throws(() => Commands.presetRecall(invalid), /expected an integer/)
  assert.throws(() => Commands.panTilt('up', invalid, 8), /expected an integer/)
  assert.throws(() => Commands.home(invalid), /expected an integer/)
}
assert.equal(hex(Commands.zoomTele()), '8101040723FF')
for (const id of [0, 8, -1]) {
  assert.throws(() => Commands.home(id), /camera ID/)
}
for (const n of [-1, 255]) {
  assert.throws(() => Commands.presetSet(n), /preset number/)
}
for (const speed of [-1, 16]) {
  assert.throws(() => Commands.zoomTele(speed), /zoom speed/)
  assert.throws(() => Commands.focusNear(speed), /focus speed/)
}
assert.throws(() => Commands.panTilt('left', 25, 8), /pan speed/)
assert.throws(() => Commands.panTilt('left', 8, 21), /tilt speed/)
for (const command of [Commands.power, Commands.autofocus, Commands.backlight, Commands.tallyRed, Commands.tallyGreen]) {
  assert.throws(() => command('off'), /must be true or false/)
  assert.throws(() => command(undefined), /must be true or false/)
}

console.log(`${cases.length + 2} Companion-module protocol checks passed`)
