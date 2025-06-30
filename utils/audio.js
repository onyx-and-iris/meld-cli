import meowHelp from 'cli-meow-help'

import { highlight, error } from './style.js'

const commands = {
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

const audioHelp = meowHelp({
  name: 'meld-cli audio',
  flags,
  commands,
  description: 'Manage audio settings in Meld',
  defaults: false
})

function audioMute (channel, audioName) {
  if (!channel.objects || !channel.objects.meld) {
    return Promise.reject(new Error(error('Meld object not found in channel.')))
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
    return Promise.reject(new Error(`No audio device with name ${audioName} found.`))
  }
  if (isMuted) {
    return Promise.resolve(`Audio track ${highlight(audioName)} is already muted.`)
  }

  return new Promise((resolve, reject) => {
    meld.toggleMute(itemId)
      .then(() => {
        resolve(`Audio track ${highlight(audioName)} has been muted.`)
      })
      .catch((err) => {
        reject(new Error(`Error muting audio track: ${err}`))
      })
  })
}

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
    return Promise.resolve(`Audio track ${audioName} is already unmuted.`)
  }

  return new Promise((resolve, reject) => {
    meld.toggleMute(itemId)
      .then(() => {
        resolve(`Audio track ${audioName} has been unmuted.`)
      })
      .catch((err) => {
        reject(new Error(`Error unmuting audio track: ${err}`))
      })
  })
}

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
    return Promise.reject(new Error(`No audio device with name ${audioName} found.`))
  }
  return new Promise((resolve, reject) => {
    meld.toggleMute(itemId)
      .then(() => {
        const status = isMuted ? 'unmuted' : 'muted'
        resolve(`Audio track ${audioName} has been ${status}.`)
      })
      .catch((err) => {
        reject(new Error(`Error toggling audio track: ${err}`))
      })
  })
}

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
    return Promise.reject(new Error(`No audio device with name ${audioName} found.`))
  }
  return new Promise((resolve, reject) => {
    resolve(`${highlight(audioName)} is ${isMuted ? 'muted' : 'unmuted'}`)
  })
}

export {
  audioHelp,
  audioMute,
  audioUnmute,
  audioToggle,
  audioStatus
}
