'use strict'
const assert = require('assert').strict
const Module = require('module')
const { Commands } = require('../src/protocol')
let Instance
const originalLoad = Module._load
Module._load = function (id, ...args) {
  if (id === '@companion-module/base') return {
    InstanceBase: class {}, Regex: {},
    InstanceStatus: { Ok: 'ok', BadConfig: 'bad-config' },
    runEntrypoint(instance) { Instance = instance },
  }
  return originalLoad.call(this, id, ...args)
}
try {
  require('../src/main')
} finally {
  Module._load = originalLoad
}

async function main() {
  let sockets = 0
  let sentHost
  const instance = new Instance()
  instance.updateStatus = (status) => { instance.status = status }
  instance.setVariableValues = () => {}
  instance.log = () => {}
  instance.createSharedUdpSocket = () => {
    sockets++
    return {
      on() {},
      send(_buffer, _port, host, callback) { sentHost = host; callback() },
    }
  }
  for (const host of ['', '   ', 123, null, undefined]) {
    instance.config = { dryRun: false, host }
    instance.configureTransport()
    assert.equal(instance.status, 'bad-config')
    assert.equal(sockets, 0)
    await assert.rejects(instance.sendVisca(Commands.home()), /not configured/)
  }
  instance.config = { dryRun: false, host: '  camera.local  ', port: '3001' }
  instance.configureTransport()
  await instance.sendVisca(Commands.home())
  assert.equal(instance.status, 'ok')
  assert.equal(sockets, 1)
  assert.equal(sentHost, 'camera.local')
  instance.config = { dryRun: true, host: '' }
  instance.configureTransport()
  await instance.sendVisca(Commands.home())
  assert.equal(sockets, 1)
  console.log('Companion transport checks passed without opening sockets')
}
main().catch((err) => { console.error(err); process.exitCode = 1 })
