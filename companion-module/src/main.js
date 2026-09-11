'use strict'

const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateVariableDefinitions = require('./variables')

class RGBlinkVueInstance extends InstanceBase {
  constructor(internal) {
    super(internal)
    this.socket = null
  }

  async init(config) {
    this.config = config
    this.updateActions()
    this.updateVariableDefinitions()
    this.setVariableValues({ last_command_hex: '', send_mode: config.dryRun === false ? 'live UDP' : 'dry run' })
    this.configureTransport()
  }

  async destroy() {
    if (this.socket) {
      try {
        this.socket.close()
      } catch (e) {
        this.log('debug', `socket close ignored: ${e.message}`)
      }
      this.socket = null
    }
  }

  async configUpdated(config) {
    await this.destroy()
    this.config = config
    this.updateActions()
    this.setVariableValues({ send_mode: config.dryRun === false ? 'live UDP' : 'dry run' })
    this.configureTransport()
  }

  configureTransport() {
    if (this.config.dryRun !== false) {
      this.updateStatus(InstanceStatus.Ok, 'Dry run: command generation only')
      return
    }

    if (!this.config.host) {
      this.updateStatus(InstanceStatus.BadConfig, 'Target host is required for live sending')
      return
    }

    this.socket = this.createSharedUdpSocket('udp4', () => {})
    this.socket.on('error', (err) => {
      this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
    })
    this.updateStatus(InstanceStatus.Ok, 'Raw VISCA UDP test mode')
  }

  async sendVisca(buffer) {
    const hex = buffer.toString('hex').toUpperCase()
    this.setVariableValues({ last_command_hex: hex })

    if (this.config.dryRun !== false) {
      this.log('info', `Dry-run VISCA: ${hex}`)
      return
    }

    if (!this.socket || !this.config.host) {
      throw new Error('Live transport is not configured')
    }

    const port = Number(this.config.port || 3001)
    await new Promise((resolve, reject) => {
      this.socket.send(buffer, port, this.config.host, (err) => (err ? reject(err) : resolve()))
    })
  }

  getConfigFields() {
    return [
      {
        type: 'static-text',
        id: 'transport_note',
        width: 12,
        label: 'Transport status',
        value: 'RGBlink documents the VISCA payloads and default port 3001. Raw UDP is exposed only as a live-test mode until the buyer camera/API documentation confirms the exact IP framing.',
      },
      {
        type: 'checkbox',
        id: 'dryRun',
        width: 4,
        label: 'Dry run (recommended until live validation)',
        default: true,
      },
      {
        type: 'textinput',
        id: 'host',
        label: 'Camera IP / hostname',
        width: 4,
        regex: Regex.HOSTNAME,
      },
      {
        type: 'textinput',
        id: 'port',
        label: 'VISCA port',
        width: 2,
        regex: Regex.PORT,
        default: '3001',
      },
      {
        type: 'number',
        id: 'cameraId',
        label: 'VISCA camera ID',
        width: 2,
        default: 1,
        min: 1,
        max: 7,
      },
    ]
  }

  updateActions() {
    UpdateActions(this)
  }

  updateVariableDefinitions() {
    UpdateVariableDefinitions(this)
  }
}

runEntrypoint(RGBlinkVueInstance, UpgradeScripts)
