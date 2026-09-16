const assert = require('assert').strict

// Exercise both shipped command builders to prevent validation drift.
let checks = 0
for (const { Commands } of [require('./visca'), require('./companion-module/src/protocol')]) {
  for (const value of ['toString', 'constructor', '__proto__', 'invalid', '', null, undefined]) {
    for (const [method, message] of [
      ['exposureMode', /unknown exposure mode/],
      ['whiteBalance', /unknown white balance mode/],
      ['iris', /unknown iris action/],
      ['panTilt', /unknown direction/],
    ]) {
      assert.throws(() => Commands[method](value), message)
      checks++
    }
  }
  assert.equal(Commands.exposureMode('auto').toString('hex'), '8101043900ff')
  assert.equal(Commands.iris('reset').toString('hex'), '8101040b00ff')
  assert.equal(Commands.whiteBalance('auto').toString('hex'), '8101043500ff')
  checks += 3
}
console.log(`${checks} command input validation checks passed`)
