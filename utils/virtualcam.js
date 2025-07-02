/**
 * @file virtualcam.js
 * @module utils/virtualcam
 * @description
 * Utilities for managing the virtual camera in a Meld session via CLI.
 * Provides commands to toggle the virtual camera on or off.
 * Integrates with cli-meow-help for command-line help.
 */
 
import meowHelp from 'cli-meow-help'

const commands = {
  toggle: {
    desc: 'Toggle the virtual camera on or off'
  }
}

const flags = {
  help: {
    type: 'boolean',
    shortFlag: 'h',
    desc: 'Display help information'
  }
}

/**
 * Contains the help information for the stream command group.
 *
 * @type {object}
 * @property {string} name - The name of the CLI command.
 * @property {string} desc - Description of the command's purpose.
 * @property {object} commands - The available subcommands.
 * @property {object} flags - The available flags for the command.
 * @property {boolean} defaults - Indicates if default values are shown.
 */
const virtualcamHelp = meowHelp({
  name: 'virtualcam',
  desc: 'Manage virtual camera settings in Meld',
  commands,
  flags,
  defaults: false
})

/**
 * Toggles the virtual camera on or off by sending a command through the provided channel.
 *
 * @async
 * @function virtualcamToggle
 * @param {object} channel - The channel object containing the 'meld' object for sending commands.
 * @returns {Promise<string>} A promise that resolves to a success message upon toggling the virtual camera.
 */
async function virtualcamToggle (channel) {
  await channel.objects.meld.sendCommand('meld.toggleVirtualCameraAction')
  return 'Virtual camera toggled successfully.'
}

export { virtualcamHelp, virtualcamToggle }
