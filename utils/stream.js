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

const streamHelp = meowHelp({
  name: 'meld-cli stream',
  flags,
  commands,
  desc: 'Manage streaming in Meld',
  defaults: false
})

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
        reject(err)
      })
  })
}

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
        reject(err)
      })
  })
}

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
        reject(err)
      })
  })
}

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
