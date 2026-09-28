const assert = require('assert').strict
const dgram = require('dgram')
const { RawViscaUdpClient, Commands } = require('./visca')

async function main() {
  const originalCreateSocket = dgram.createSocket
  let closes = 0
  let sends = 0
  dgram.createSocket = () => ({
    send(_buffer, _port, _host, callback) { sends++; callback() },
    close() {
      closes++
      const err = new Error('not running')
      err.code = 'ERR_SOCKET_DGRAM_NOT_RUNNING'
      throw err
    },
  })
  try {
    const unused = new RawViscaUdpClient({ host: 'localhost' })
    assert.doesNotThrow(() => unused.close())
    assert.doesNotThrow(() => unused.close())
    assert.equal(closes, 1)
    await assert.rejects(unused.send(Commands.home()), /client is closed/)
    assert.equal(sends, 0)

    dgram.createSocket = () => ({
      send(_buffer, _port, _host, callback) { sends++; callback() },
      close() { closes++ },
    })
    const active = new RawViscaUdpClient({ host: 'localhost' })
    await active.send(Commands.home())
    active.close()
    active.close()
    assert.equal(sends, 1)
    assert.equal(closes, 2)
    console.log('UDP lifecycle checks passed without opening sockets')
  } finally {
    dgram.createSocket = originalCreateSocket
  }
}

main().catch((err) => { console.error(err); process.exitCode = 1 })
