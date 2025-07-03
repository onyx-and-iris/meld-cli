/**
 * @file screenshot.js
 * @module utils/screenshot
 * @description
 * Utilities for managing screenshots in a Meld session via CLI.
 * Provides commands to take screenshots and display help information.
 * Integrates with cli-meow-help for command-line help.
 */

import meowHelp from 'cli-meow-help'

/**
 * Contains the help information for the screenshot command group.
 *
 * @type {object}
 * @property {string} name - The name of the CLI command.
 * @property {string} desc - Description of the command's purpose.
 * @property {object} commands - The available subcommands.
 * @property {object} flags - The available flags for the command.
 * @property {boolean} defaults - Indicates if default values are shown.
 */
const screenshotHelp = meowHelp({
  name: 'meld-cli screenshot',
  desc: 'Manage screenshots in Meld',
  commands: {
    take: {
      desc: 'Take a screenshot'
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
 * Takes a screenshot by sending the 'meld.screenshot' command through the provided channel.
 *
 * @async
 * @param {Object} channel - The communication channel with Meld.
 * @returns {Promise<string>} Resolves with a success message when the screenshot is taken.
 */
async function screenshotTake (channel) {
  await channel.objects.meld.sendCommand('meld.screenshot')
  return 'Screenshot taken successfully.'
}

export { screenshotHelp, screenshotTake }
