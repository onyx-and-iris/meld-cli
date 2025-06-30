import meowHelp from 'cli-meow-help'
import Table from 'cli-table3'

import { highlight, error, errorHighlight } from './style.js'

const commands = {
  list: {
    desc: 'List all scenes'
  },
  switch: {
    desc: 'Switch to a scene by name'
  },
  current: {
    desc: 'Show the current scene'
  }
}

const flags = {
  help: {
    type: 'boolean',
    shortFlag: 'h',
    desc: 'Display help information'
  }
}

const sceneHelp = meowHelp({
  name: 'meld-cli scene',
  flags,
  commands,
  description: 'Manage scenes in Meld',
  defaults: false
})

function sceneList (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const table = new Table({
    style: {
      head: ['none'],
      compact: true
    },
    head: [{ content: 'Scene Name', hAlign: 'center' }, { content: 'ID', hAlign: 'center' }]
  })

  const meld = channel.objects.meld
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'scene') {
      table.push([highlight(value.name), highlight(key)])
    }
  }
  if (table.length === 0) {
    return Promise.reject(new Error('No scenes found.'))
  }
  return Promise.resolve(table.toString())
}

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
    return Promise.reject(new Error(error(`No scene with name ${errorHighlight(sceneName)} found.`)))
  }

  return new Promise((resolve, reject) => {
    meld.showScene(itemId).then(() => {
      resolve(`Switched to scene: ${highlight(sceneName)}`)
    }).catch(err => {
      reject(err)
    })
  })
}

function sceneCurrent (channel) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'scene' && value.current) {
      return Promise.resolve(`Current scene: ${highlight(value.name)} (ID: ${highlight(key)})`)
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
