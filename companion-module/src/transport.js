'use strict'

function parseUdpPort(value) {
  if (value === undefined || value === null || value === '') return 3001
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) {
    throw new Error('valid UDP port is required (1-65535)')
  }
  const port = Number(value)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('valid UDP port is required (1-65535)')
  }
  return port
}

module.exports = { parseUdpPort }
