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
  description: 'A command-line interface for managing scenes in Meld',
  defaults: false
})

export default meow(helpText, {
  importMeta: import.meta,
  flags
})
