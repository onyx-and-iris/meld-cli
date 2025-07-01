import meowHelp from 'cli-meow-help'

const clipHelp = meowHelp({
  name: 'meld-cli clip',
  desc: 'Manage clips in Meld',
  commands: {
    save: {
      desc: 'Save a clip'
    }
  },
  flags: {
    help: {
      type: 'boolean',
      shortFlag: 'h',
      desc: 'Display help information'
    }
  },
  defaults: false
})

async function clipSave (channel) {
  await channel.objects.meld.sendCommand('meld.recordClip')
  return 'Clip saved successfully.'
}

export { clipHelp, clipSave }
