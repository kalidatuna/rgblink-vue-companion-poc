const dgram = require('dgram')
const { Commands } = require('./companion-module/src/protocol')

class RawViscaUdpClient {
  constructor({ host, port = 3001, cameraId = 1 }) {
    if (!host) throw new Error('host is required')
    if (!Number.isInteger(Number(port)) || Number(port) < 1 || Number(port) > 65535) {
      throw new Error('valid UDP port is required')
    }
    Object.assign(this, { host, port: Number(port), cameraId })
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
