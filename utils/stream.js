/**
 * @file stream.js
 * @module utils/stream
 * @description
 * Utilities for managing streaming in a Meld session via CLI.
 * Provides commands to start, stop, toggle, and check the status of streaming.
 * Integrates with cli-meow-help for command-line help.
 */

import meowHelp from 'cli-meow-help'

const commands = {
  start: {
    desc: 'Start streaming'
  },
  stop: {
    desc: 'Stop streaming'
  },
  toggle: {
    desc: 'Toggle streaming state'
  },
  status: {
    desc: 'Show the current streaming status'
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
const streamHelp = meowHelp({
  name: 'meld-cli stream',
  desc: 'Manage streaming in Meld',
  commands,
  flags,
  defaults: false
})

/**
 * Start streaming if not already active.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */
function streamStart (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  if (meld.isStreaming) {
    return Promise.reject(new Error('Streaming is already active.'))
  }

  return new Promise((resolve, reject) => {
    meld.toggleStream()
      .then(() => {
        resolve('Streaming started successfully.')
      })
      .catch((err) => {
        reject(new Error(`Failed to start streaming: ${err.message}`))
      })
  })
}

/**
 * Stop streaming if currently active.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */

function streamStop (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  if (!meld.isStreaming) {
    return Promise.reject(new Error('Streaming is not currently active.'))
  }

  return new Promise((resolve, reject) => {
    meld.toggleStream()
      .then(() => {
        resolve('Streaming stopped successfully.')
      })
      .catch((err) => {
        reject(new Error(`Failed to stop streaming: ${err.message}`))
      })
  })
}

/**
 * Toggle the streaming state.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a message indicating the new streaming state or rejects with an error.
 */
function streamToggle (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  return new Promise((resolve, reject) => {
    meld.toggleStream()
      .then(() => {
        resolve(`Streaming ${meld.isStreaming ? 'stopped' : 'started'} successfully.`)
      })
      .catch((err) => {
        reject(new Error(`Failed to toggle streaming: ${err.message}`))
      })
  })
}

/**
 * Get the current streaming status.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a message indicating whether streaming is active or inactive.
 */
function streamStatus (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  return Promise.resolve(`Streaming is currently ${meld.isStreaming ? 'active' : 'inactive'}`)
}

export {
  streamStart,
  streamStop,
  streamToggle,
  streamStatus,
  streamHelp
}
