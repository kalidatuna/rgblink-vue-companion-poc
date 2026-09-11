'use strict'

const { Commands } = require('./protocol')

const onOff = [
  { id: 'on', label: 'On' },
  { id: 'off', label: 'Off' },
]

module.exports = function updateActions(self) {
  const cameraId = () => Number(self.config.cameraId || 1)
  const send = (buffer) => self.sendVisca(buffer)

  self.setActionDefinitions({
    pan_tilt: {
      name: 'Pan / Tilt',
      options: [
        {
          id: 'direction',
          type: 'dropdown',
          label: 'Direction',
          default: 'stop',
          choices: [
            { id: 'up', label: 'Up' },
            { id: 'down', label: 'Down' },
            { id: 'left', label: 'Left' },
            { id: 'right', label: 'Right' },
            { id: 'upLeft', label: 'Up left' },
            { id: 'upRight', label: 'Up right' },
            { id: 'downLeft', label: 'Down left' },
            { id: 'downRight', label: 'Down right' },
            { id: 'stop', label: 'Stop' },
          ],
        },
        { id: 'panSpeed', type: 'number', label: 'Pan speed', default: 8, min: 1, max: 24 },
        { id: 'tiltSpeed', type: 'number', label: 'Tilt speed', default: 8, min: 1, max: 20 },
      ],
      callback: async (event) => send(Commands.panTilt(event.options.direction, event.options.panSpeed, event.options.tiltSpeed, cameraId())),
    },

    home: {
      name: 'Home',
      options: [],
      callback: async () => send(Commands.home(cameraId())),
    },

    zoom: {
      name: 'Zoom',
      options: [
        {
          id: 'direction',
          type: 'dropdown',
          label: 'Direction',
          default: 'stop',
          choices: [
            { id: 'tele', label: 'Tele / In' },
            { id: 'wide', label: 'Wide / Out' },
            { id: 'stop', label: 'Stop' },
          ],
        },
        { id: 'speed', type: 'number', label: 'Speed', default: 3, min: 0, max: 15 },
      ],
      callback: async (event) => {
        const direction = event.options.direction
        const buffer = direction === 'tele'
          ? Commands.zoomTele(event.options.speed, cameraId())
          : direction === 'wide'
            ? Commands.zoomWide(event.options.speed, cameraId())
            : Commands.zoomStop(cameraId())
        return send(buffer)
      },
    },

    focus: {
      name: 'Manual focus',
      options: [
        {
          id: 'direction',
          type: 'dropdown',
          label: 'Direction',
          default: 'stop',
          choices: [
            { id: 'near', label: 'Near' },
            { id: 'far', label: 'Far' },
            { id: 'stop', label: 'Stop' },
          ],
        },
        { id: 'speed', type: 'number', label: 'Speed', default: 3, min: 0, max: 15 },
      ],
      callback: async (event) => {
        const direction = event.options.direction
        const buffer = direction === 'near'
          ? Commands.focusNear(event.options.speed, cameraId())
          : direction === 'far'
            ? Commands.focusFar(event.options.speed, cameraId())
            : Commands.focusStop(cameraId())
        return send(buffer)
      },
    },

    autofocus: {
      name: 'Autofocus',
      options: [{ id: 'state', type: 'dropdown', label: 'State', default: 'on', choices: onOff }],
      callback: async (event) => send(Commands.autofocus(event.options.state === 'on', cameraId())),
    },

    preset: {
      name: 'Preset',
      options: [
        {
          id: 'operation',
          type: 'dropdown',
          label: 'Operation',
          default: 'recall',
          choices: [
            { id: 'recall', label: 'Recall' },
            { id: 'set', label: 'Save / Set' },
            { id: 'clear', label: 'Clear' },
          ],
        },
        { id: 'number', type: 'number', label: 'Preset number', default: 1, min: 0, max: 254 },
      ],
      callback: async (event) => {
        const n = event.options.number
        const buffer = event.options.operation === 'set'
          ? Commands.presetSet(n, cameraId())
          : event.options.operation === 'clear'
            ? Commands.presetClear(n, cameraId())
            : Commands.presetRecall(n, cameraId())
        return send(buffer)
      },
    },

    exposure_mode: {
      name: 'Exposure mode',
      options: [
        {
          id: 'mode',
          type: 'dropdown',
          label: 'Mode',
          default: 'auto',
          choices: ['auto', 'manual', 'shutter', 'iris', 'bright'].map((id) => ({ id, label: id })),
        },
      ],
      callback: async (event) => send(Commands.exposureMode(event.options.mode, cameraId())),
    },

    iris: {
      name: 'Iris',
      options: [
        {
          id: 'operation',
          type: 'dropdown',
          label: 'Operation',
          default: 'reset',
          choices: ['reset', 'up', 'down'].map((id) => ({ id, label: id })),
        },
      ],
      callback: async (event) => send(Commands.iris(event.options.operation, cameraId())),
    },

    white_balance: {
      name: 'White balance',
      options: [
        {
          id: 'mode',
          type: 'dropdown',
          label: 'Mode',
          default: 'auto',
          choices: ['auto', 'k3000', 'k4000', 'onePush', 'k5000', 'manual', 'k6500'].map((id) => ({ id, label: id })),
        },
      ],
      callback: async (event) => send(Commands.whiteBalance(event.options.mode, cameraId())),
    },

    backlight: {
      name: 'Backlight compensation',
      options: [{ id: 'state', type: 'dropdown', label: 'State', default: 'off', choices: onOff }],
      callback: async (event) => send(Commands.backlight(event.options.state === 'on', cameraId())),
    },

    tally_red: {
      name: 'Tally red',
      options: [{ id: 'state', type: 'dropdown', label: 'State', default: 'on', choices: onOff }],
      callback: async (event) => send(Commands.tallyRed(event.options.state === 'on')),
    },

    tally_green: {
      name: 'Tally green',
      options: [{ id: 'state', type: 'dropdown', label: 'State', default: 'on', choices: onOff }],
      callback: async (event) => send(Commands.tallyGreen(event.options.state === 'on')),
    },
  })
}
