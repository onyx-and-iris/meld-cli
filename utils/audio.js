/**
 * @file audio.js
 * @module utils/audio
 * @description
 * Utilities for managing audio tracks in a Meld session via CLI.
 * Provides commands to list, mute, unmute, toggle, and check the status of audio tracks.
 * Integrates with cli-meow-help for command-line help and cli-table3 for tabular output.
 */

import meowHelp from 'cli-meow-help'
import Table from 'cli-table3'

import style from './style.js'

const commands = {
  list: {
    desc: 'List all audio devices'
  },
  mute: {
    desc: 'Mute the audio'
  },
  unmute: {
    desc: 'Unmute the audio'
  },
  toggle: {
    desc: 'Toggle audio mute state'
  },
  status: {
    desc: 'Show current audio status'
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
 * Contains the help information for the audio command group.
 *
 * @type {object}
 * @property {string} name - The name of the CLI command.
 * @property {string} desc - Description of the command's purpose.
 * @property {object} commands - The available subcommands.
 * @property {object} flags - The available flags for the command.
 * @property {boolean} defaults - Indicates if default values are shown.
 */
const audioHelp = meowHelp({
  name: 'meld-cli audio',
  desc: 'Manage audio settings in Meld',
  commands,
  flags,
  defaults: false
})

/**
 * List all audio tracks in the Meld session.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {boolean} showId - Whether to display the audio track ID.
 * @returns {Promise<Table|string>} Resolves with a Table instance or a message if no devices found.
 */
function audioList (channel, showId) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const headers = [{ content: 'Audio Name', hAlign: 'center' }, { content: 'Muted', hAlign: 'center' }]
  if (showId) {
    headers.push({ content: 'ID', hAlign: 'center' })
  }
  const table = new Table({
    style: {
      head: ['none'],
      compact: true
    },
    head: headers
  })

  const meld = channel.objects.meld
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'track') {
      if (showId) {
        table.push([style.highlight(value.name), { content: value.muted ? style.highlight('✓') : '✗', hAlign: 'center' }, style.highlight(key)])
      } else {
        table.push([style.highlight(value.name), { content: value.muted ? style.highlight('✓') : '✗', hAlign: 'center' }])
      }
    }
  }

  if (table.length === 0) {
    return Promise.resolve('No audio devices found.')
  }
  return Promise.resolve(table)
}

/**
 * Mute a specific audio track by name.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {string} audioName - The name of the audio track to mute.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */
function audioMute (channel, audioName) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }
  const meld = channel.objects.meld
  let itemId
  let isMuted
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'track' && value.name === audioName) {
      itemId = key
      isMuted = value.muted
      break
    }
  }

  if (!itemId) {
    return Promise.reject(new Error(`No audio device with name ${style.errHighlight(audioName)} found.`))
  }
  if (isMuted) {
    return Promise.reject(new Error(`Audio track ${style.errHighlight(audioName)} is already muted.`))
  }

  return new Promise((resolve, reject) => {
    meld.toggleMute(itemId)
      .then(() => {
        resolve(`Audio track ${style.highlight(audioName)} has been muted.`)
      })
      .catch((err) => {
        reject(new Error(`Error muting audio track: ${err.message}`))
      })
  })
}

/**
 * Unmute a specific audio track by name.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {string} audioName - The name of the audio track to unmute.
 * @returns {Promise<string>} Resolves with a success message or rejects with an error.
 */
function audioUnmute (channel, audioName) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }
  const meld = channel.objects.meld
  let itemId
  let isMuted
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'track' && value.name === audioName) {
      itemId = key
      isMuted = value.muted
      break
    }
  }
  if (!itemId) {
    return Promise.reject(new Error('No audio track found.'))
  }
  if (!isMuted) {
    return Promise.reject(new Error(`Audio track ${style.errHighlight(audioName)} is already unmuted.`))
  }

  return new Promise((resolve, reject) => {
    meld.toggleMute(itemId)
      .then(() => {
        resolve(`Audio track ${style.highlight(audioName)} has been unmuted.`)
      })
      .catch((err) => {
        reject(new Error(`Error unmuting audio track: ${err.message}`))
      })
  })
}

/**
 * Toggle the mute state of a specific audio track by name.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {string} audioName - The name of the audio track to toggle.
 * @returns {Promise<string>} Resolves with a message indicating the new state or rejects with an error.
 */
function audioToggle (channel, audioName) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }
  const meld = channel.objects.meld
  let itemId
  let isMuted
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'track' && value.name === audioName) {
      itemId = key
      isMuted = value.muted
      break
    }
  }
  if (!itemId) {
    return Promise.reject(new Error(`No audio device with name ${style.errHighlight(audioName)} found.`))
  }

  return new Promise((resolve, reject) => {
    meld.toggleMute(itemId)
      .then(() => {
        const status = isMuted ? 'unmuted' : 'muted'
        resolve(`Audio track ${style.highlight(audioName)} has been ${status}.`)
      })
      .catch((err) => {
        reject(new Error(`Error toggling audio track: ${err.message}`))
      })
  })
}

/**
 * Get the mute status of a specific audio track by name.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {string} audioName - The name of the audio track to check.
 * @returns {Promise<string>} Resolves with the current mute status or rejects with an error.
 */
function audioStatus (channel, audioName) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }
  const meld = channel.objects.meld
  let itemId
  let isMuted
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'track' && value.name === audioName) {
      itemId = key
      isMuted = value.muted
      break
    }
  }
  if (!itemId) {
    return Promise.reject(new Error(`No audio device with name ${style.errHighlight(audioName)} found.`))
  }

  return new Promise((resolve, reject) => {
    resolve(`${style.highlight(audioName)} is ${isMuted ? 'muted' : 'unmuted'}`)
  })
}

export {
  audioHelp,
  audioList,
  audioMute,
  audioUnmute,
  audioToggle,
  audioStatus
}
