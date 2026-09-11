'use strict'

module.exports = function updateVariableDefinitions(self) {
  self.setVariableDefinitions({
    last_command_hex: { name: 'Last generated VISCA command (hex)' },
    send_mode: { name: 'Send mode' },
  })
}
