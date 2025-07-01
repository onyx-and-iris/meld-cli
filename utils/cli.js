import meow from 'meow'
import meowHelp from 'cli-meow-help'

const commands = {
  scene: {
    desc: 'Manage scenes'
  },
  audio: {
    desc: 'Manage audio settings'
  },
  stream: {
    desc: 'Manage streaming'
  },
  record: {
    desc: 'Manage recording'
  },
  clip: {
    desc: 'Save a clip'
  },
  screenshot: {
    desc: 'Take a screenshot'
  },
  virtualcam: {
    desc: 'Manage virtual camera settings'
  }
}

const flags = {
  host: {
    type: 'string',
    shortFlag: 'H',
    desc: 'Host address for the Meld server'
  },
  port: {
    type: 'number',
    shortFlag: 'P',
    desc: 'Port number for the Meld server'
  },
  help: {
    type: 'boolean',
    shortFlag: 'h',
    desc: 'Display help information'
  },
  version: {
    type: 'boolean',
    shortFlag: 'v',
    desc: 'Display the version number'
  }
}

const helpText = meowHelp({
  name: 'meld-cli',
  flags,
  commands,
  defaults: false
})

export default meow(helpText, {
  importMeta: import.meta,
  flags
})
