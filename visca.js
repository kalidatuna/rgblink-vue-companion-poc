const dgram = require('dgram')

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, Number(n)))
}

function cameraAddr(id = 1) {
  return 0x80 + clamp(Number(id) || 1, 1, 7)
}

function cmd(bytes, id = 1) {
  return Buffer.from([cameraAddr(id), ...bytes, 0xff])
}

// RGBlink VUE VISCA command payloads from the manufacturer's Broadcast PTZ Camera manual.
const Commands = {
  power(on, id = 1) {
    return cmd([0x01, 0x04, 0x00, on ? 0x02 : 0x03], id)
  },
  home(id = 1) {
    return cmd([0x01, 0x06, 0x04], id)
  },

  zoomStop(id = 1) {
    return cmd([0x01, 0x04, 0x07, 0x00], id)
  },
  zoomTele(speed = 3, id = 1) {
    return cmd([0x01, 0x04, 0x07, 0x20 + clamp(speed, 0, 15)], id)
  },
  zoomWide(speed = 3, id = 1) {
    return cmd([0x01, 0x04, 0x07, 0x30 + clamp(speed, 0, 15)], id)
  },

  focusStop(id = 1) {
    return cmd([0x01, 0x04, 0x08, 0x00], id)
  },
  focusFar(speed = 3, id = 1) {
    return cmd([0x01, 0x04, 0x08, 0x20 + clamp(speed, 0, 15)], id)
  },
  focusNear(speed = 3, id = 1) {
    return cmd([0x01, 0x04, 0x08, 0x30 + clamp(speed, 0, 15)], id)
  },
  autofocus(on, id = 1) {
    return cmd([0x01, 0x04, 0x38, on ? 0x02 : 0x03], id)
  },

  exposureMode(mode, id = 1) {
    const modes = {
      auto: 0x00,
      manual: 0x03,
      shutter: 0x0a,
      iris: 0x0b,
      bright: 0x0d,
    }
    if (!(Object.prototype.hasOwnProperty.call(modes, mode))) throw new Error(`unknown exposure mode: ${mode}`)
    return cmd([0x01, 0x04, 0x39, modes[mode]], id)
  },
  iris(action, id = 1) {
    const actions = { reset: 0x00, up: 0x02, down: 0x03 }
    if (!(Object.prototype.hasOwnProperty.call(actions, action))) throw new Error(`unknown iris action: ${action}`)
    return cmd([0x01, 0x04, 0x0b, actions[action]], id)
  },
  backlight(on, id = 1) {
    return cmd([0x01, 0x04, 0x33, on ? 0x02 : 0x03], id)
  },
  whiteBalance(mode, id = 1) {
    const modes = {
      auto: 0x00,
      k3000: 0x01,
      k4000: 0x02,
      onePush: 0x03,
      k5000: 0x04,
      manual: 0x05,
      k6500: 0x06,
    }
    if (!(Object.prototype.hasOwnProperty.call(modes, mode))) throw new Error(`unknown white balance mode: ${mode}`)
    return cmd([0x01, 0x04, 0x35, modes[mode]], id)
  },

  presetRecall(n, id = 1) {
    return cmd([0x01, 0x04, 0x3f, 0x02, clamp(n, 0, 254)], id)
  },
  presetSet(n, id = 1) {
    return cmd([0x01, 0x04, 0x3f, 0x01, clamp(n, 0, 254)], id)
  },
  presetClear(n, id = 1) {
    return cmd([0x01, 0x04, 0x3f, 0x00, clamp(n, 0, 254)], id)
  },

  tallyRed(on) {
    return Buffer.from([0x81, 0x01, 0x7e, 0x01, 0x0a, 0x00, on ? 0x01 : 0x02, 0xff])
  },
  tallyGreen(on) {
    return Buffer.from([0x81, 0x01, 0x7e, 0x01, 0x0a, 0x00, on ? 0x03 : 0x04, 0xff])
  },

  panTilt(direction, panSpeed = 8, tiltSpeed = 8, id = 1) {
    const dirs = {
      up: [0x03, 0x01],
      down: [0x03, 0x02],
      left: [0x01, 0x03],
      right: [0x02, 0x03],
      upLeft: [0x01, 0x01],
      upRight: [0x02, 0x01],
      downLeft: [0x01, 0x02],
      downRight: [0x02, 0x02],
      stop: [0x03, 0x03],
    }
    const d = dirs[direction]
    if (!Object.prototype.hasOwnProperty.call(dirs, direction)) throw new Error(`unknown direction: ${direction}`)
    return cmd(
      [
        0x01,
        0x06,
        0x01,
        clamp(panSpeed, 1, 0x18),
        clamp(tiltSpeed, 1, 0x14),
        ...d,
      ],
      id,
    )
  },
}

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
