/**
 * @file record.js
 * @module utils/record
 * @description
 * Utilities for managing recording state in a Meld session via CLI.
 * Provides commands to start, stop, toggle, and check the status of recording.
 * Integrates with cli-meow-help for command-line help.
 */

import meowHelp from 'cli-meow-help'

const commands = {
  start: {
    desc: 'Start recording'
  },
  stop: {
    desc: 'Stop recording'
  },
  toggle: {
    desc: 'Toggle recording state'
  },
  status: {
    desc: 'Show the current recording status'
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
 * Contains the help information for the record command group.
 *
 * @type {object}
 * @property {string} name - The name of the CLI command.
 * @property {string} desc - Description of the command's purpose.
 * @property {object} commands - The available subcommands.
 * @property {object} flags - The available flags for the command.
 * @property {boolean} defaults - Indicates if default values are shown.
 */
const recordHelp = meowHelp({
  name: 'meld-cli record',
  desc: 'Manage recording in Meld',
  commands,
  flags,
  defaults: false
})

/**
 * Start recording using the Meld object in the provided channel.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */
function recordStart (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  if (meld.isRecording) {
    return Promise.reject(new Error('Recording is already active.'))
  }

  return new Promise((resolve, reject) => {
    meld.toggleRecord()
      .then(() => {
        resolve('Recording started successfully.')
      })
      .catch((err) => {
        reject(new Error(`Failed to start recording: ${err.message}`))
      })
  })
}

/**
 * Stop recording using the Meld object in the provided channel.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */
function recordStop (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  if (!meld.isRecording) {
    return Promise.reject(new Error('Recording is not currently active.'))
  }

  return new Promise((resolve, reject) => {
    meld.toggleRecord()
      .then(() => {
        resolve('Recording stopped successfully.')
      })
      .catch((err) => {
        reject(new Error(`Failed to stop recording: ${err.message}`))
      })
  })
}

/**
 * Toggle the recording state using the Meld object in the provided channel.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a message indicating the new recording state or rejects with an error.
 */
function recordToggle (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  return new Promise((resolve, reject) => {
    meld.toggleRecord()
      .then(() => {
        resolve(`Recording ${meld.isRecording ? 'stopped' : 'started'} successfully.`)
      })
      .catch((err) => {
        reject(new Error(`Failed to toggle recording: ${err.message}`))
      })
  })
}

/**
 * Get the current recording status from the Meld object in the provided channel.
 * @function
 * @param {Object} channel - The channel object containing Meld.
 * @returns {Promise<string>} Resolves with a message indicating if recording is active or inactive.
 */
function recordStatus (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  return Promise.resolve(`Recording is currently ${meld.isRecording ? 'active' : 'inactive'}`)
}

export {
  recordHelp,
  recordStart,
  recordStop,
  recordToggle,
  recordStatus
}
