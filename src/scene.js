/**
 * @file scene.js
 * @module utils/scene
 * @description
 * Utilities for managing scenes in a Meld session via CLI.
 * Provides commands to list, switch, and show the current scene.
 * Integrates with cli-meow-help for command-line help and cli-table3 for tabular output.
 */

import meowHelp from 'cli-meow-help'
import Table from 'cli-table3'

import style from './style.js'

const commands = {
  list: {
    desc: 'List all scenes, optionally showing IDs'
  },
  switch: {
    desc: 'Switch to a scene by name'
  },
  current: {
    desc: 'Show the current scene, optionally showing its ID'
  }
}

const flags = {
  help: {
    type: 'boolean',
    shortFlag: 'h',
    desc: 'Display help information'
  },
  id: {
    type: 'boolean',
    desc: 'Display scene IDs'
  }
}

/**
 * Contains the help information for the scene command group.
 *
 * @type {object}
 * @property {string} name - The name of the CLI command.
 * @property {string} desc - Description of the command's purpose.
 * @property {object} commands - The available subcommands.
 * @property {object} flags - The available flags for the command.
 * @property {boolean} defaults - Indicates if default values are shown.
 */
const sceneHelp = meowHelp({
  name: 'meld-cli scene',
  desc: 'Manage scenes in Meld',
  commands,
  flags,
  defaults: false
})

/**
 * Lists all scenes in the current Meld session, optionally showing their IDs.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {boolean} showId - Whether to display scene IDs in the output.
 * @returns {Promise<Table|string>} A promise that resolves to a Table instance or a message if no scenes are found.
 */
function sceneList (channel, showId) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const headers = [{ content: 'Scene Name', hAlign: 'center' }, { content: 'Active', hAlign: 'center' }]
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
    if (value.type === 'scene') {
      if (showId) {
        table.push([style.highlight(value.name), { content: value.current ? style.highlight('✓') : '✗', hAlign: 'center' }, style.highlight(key)])
      } else {
        table.push([style.highlight(value.name), { content: value.current ? style.highlight('✓') : '✗', hAlign: 'center' }])
      }
    }
  }

  if (table.length === 0) {
    return Promise.resolve('No scenes found.')
  }
  return Promise.resolve(table)
}

/**
 * Switches to a scene by its name.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {string} sceneName - The name of the scene to switch to.
 * @returns {Promise<string>} A promise that resolves to a confirmation message or rejects if the scene is not found.
 */
function sceneSwitch (channel, sceneName) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  let itemId
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'scene' && value.name === sceneName) {
      itemId = key
      break
    }
  }
  if (!itemId) {
    return Promise.reject(new Error(`No scene with name ${style.errHighlight(sceneName)} found.`))
  }

  return new Promise((resolve, reject) => {
    meld.showScene(itemId).then(() => {
      resolve(`Switched to scene: ${style.highlight(sceneName)}`)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * Shows the current active scene, optionally displaying its ID.
 * @param {Object} channel - The channel object containing Meld session data.
 * @param {boolean} showId - Whether to display the scene ID.
 * @returns {Promise<string>} A promise that resolves to the current scene information or rejects if not found.
 */
function sceneCurrent (channel, showId) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'scene' && value.current) {
      if (showId) {
        return Promise.resolve(`Current scene: ${style.highlight(value.name)} (ID: ${style.highlight(key)})`)
      }
      return Promise.resolve(`Current scene: ${style.highlight(value.name)}`)
    }
  }
  return Promise.reject(new Error('No current scene found.'))
}

export {
  sceneHelp,
  sceneList,
  sceneSwitch,
  sceneCurrent
}
