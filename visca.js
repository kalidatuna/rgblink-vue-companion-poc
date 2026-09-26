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
  }

  send(buffer) {
    return new Promise((resolve, reject) => {
      this.socket.send(buffer, this.port, this.host, (err) => (err ? reject(err) : resolve()))
    })
  }

  close() {
    this.socket.close()
  }
}

module.exports = { Commands, RawViscaUdpClient }
