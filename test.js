const assert = require('assert').strict
const { Commands } = require('./visca')

const hex = (buffer) => buffer.toString('hex').toUpperCase()

const cases = [
  [Commands.power(true), '8101040002FF'],
  [Commands.zoomTele(2), '8101040722FF'],
  [Commands.zoomWide(15), '810104073FFF'],
  [Commands.autofocus(true), '8101043802FF'],
  [Commands.autofocus(false), '8101043803FF'],
  [Commands.exposureMode('iris'), '810104390BFF'],
  [Commands.iris('up'), '8101040B02FF'],
  [Commands.whiteBalance('onePush'), '8101043503FF'],
  [Commands.backlight(true), '8101043302FF'],
  [Commands.presetSet(5), '8101043F0105FF'],
  [Commands.presetRecall(5), '8101043F0205FF'],
  [Commands.presetClear(5), '8101043F0005FF'],
  [Commands.home(), '81010604FF'],
  [Commands.panTilt('up', 14, 14), '810106010E0E0301FF'],
  [Commands.panTilt('stop', 24, 20), '8101060118140303FF'],
  [Commands.tallyRed(true), '81017E010A0001FF'],
  [Commands.tallyRed(false), '81017E010A0002FF'],
  [Commands.tallyGreen(true), '81017E010A0003FF'],
  [Commands.tallyGreen(false), '81017E010A0004FF'],
]

for (const [actual, expected] of cases) {
  assert.equal(hex(actual), expected)
}

assert.throws(() => Commands.panTilt('bad'), /unknown direction/)
assert.throws(() => Commands.exposureMode('bad'), /unknown exposure mode/)

console.log(`${cases.length + 2} protocol/validation checks passed`)
