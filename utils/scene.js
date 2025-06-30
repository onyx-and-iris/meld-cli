import meowHelp from 'cli-meow-help'
import Table from 'cli-table3'

import { highlight, error, errorHighlight } from './style.js'

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

const sceneHelp = meowHelp({
  name: 'meld-cli scene',
  flags,
  commands,
  desc: 'Manage scenes in Meld',
  defaults: false
})

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
        table.push([highlight(value.name), { content: value.current ? highlight('✓') : '✗', hAlign: 'center' }, highlight(key)])
      } else {
        table.push([highlight(value.name), { content: value.current ? highlight('✓') : '✗', hAlign: 'center' }])
      }
    }
  }
  if (table.length === 0) {
    return Promise.reject(new Error('No scenes found.'))
  }
  return Promise.resolve(table)
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

function sceneCurrent (channel, showId) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error('Meld object not found in channel.'))
  }

  const meld = channel.objects.meld
  for (const [key, value] of Object.entries(meld.session.items)) {
    if (value.type === 'scene' && value.current) {
      if (showId) {
        return Promise.resolve(`Current scene: ${highlight(value.name)} (ID: ${highlight(key)})`)
      }
      return Promise.resolve(`Current scene: ${highlight(value.name)}`)
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
