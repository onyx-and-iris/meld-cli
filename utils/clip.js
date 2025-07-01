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

async function saveClip(channel) {
  try {
    await channel.objects.meld.sendCommand('meld.recordClip');
    return 'Clip command sent successfully.';
  } catch (err) {
    throw err;
  }
}

export { clipHelp, saveClip }
