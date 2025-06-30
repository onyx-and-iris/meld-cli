import meowHelp from 'cli-meow-help'

const commands = {
  start: {
    desc: 'Start recording'
  },
  stop: {
    desc: 'Stop recording'
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

const recordHelp = meowHelp({
  name: 'meld-cli record',
  flags,
  commands,
  description: 'Manage recording in Meld',
  defaults: false
})

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
        reject(err)
      })
  })
}

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
        reject(err)
      })
  })
}

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
  recordStatus
}
