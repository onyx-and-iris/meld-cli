/**
 * @file clip.js
 * @module utils/clip
 * @description
 * Utilities for managing clips in a Meld session via CLI.
 * Provides commands to save clips and display help information.
 * Integrates with cli-meow-help for command-line help.
 */

import meowHelp from 'cli-meow-help'

/**
 * Contains the help information for the clip command group.
 *
 * @type {object}
 * @property {string} name - The name of the CLI command.
 * @property {string} desc - Description of the command's purpose.
 * @property {object} commands - The available subcommands.
 * @property {object} flags - The available flags for the command.
 * @property {boolean} defaults - Indicates if default values are shown.
 */
const clipHelp = meowHelp({
  name: 'meld-cli clip',
  desc: 'Manage clips in Meld',
  commands: {
    save: {
      desc: 'Save a clip'
    }
  },
  flags: {
    help: {
      type: 'boolean',
      shortFlag: 'h',
      desc: 'Display help information'
    }
  },
  defaults: false
})

/**
 * Save a clip.
 * @param {Object} channel - The channel object containing Meld session data.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */
async function clipSave (channel) {
  await channel.objects.meld.sendCommand('meld.recordClip')
  return 'Clip saved successfully.'
}

export { clipHelp, clipSave }
