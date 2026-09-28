const dgram = require('dgram')
const { Commands } = require('./companion-module/src/protocol')
const { parseUdpPort } = require('./companion-module/src/transport')

class RawViscaUdpClient {
  constructor({ host, port = 3001, cameraId = 1 }) {
    if (typeof host !== 'string' || !host.trim()) throw new Error('host is required')
    const validPort = parseUdpPort(port)
    Commands.home(cameraId)
    Object.assign(this, { host: host.trim(), port: validPort, cameraId })
    this.socket = dgram.createSocket('udp4')
    this.closed = false
  }

  send(buffer) {
    if (this.closed) return Promise.reject(new Error('VISCA client is closed'))
    return new Promise((resolve, reject) => {
      this.socket.send(buffer, this.port, this.host, (err) => (err ? reject(err) : resolve()))
    })
  }

  close() {
    if (this.closed) return
    this.closed = true
    try {
      this.socket.close()
    } catch (err) {
      if (err.code !== 'ERR_SOCKET_DGRAM_NOT_RUNNING') throw err
    }
  }
}

module.exports = { Commands, RawViscaUdpClient }
