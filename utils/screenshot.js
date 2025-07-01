import meowHelp from 'cli-meow-help'

const screenshotHelp = meowHelp({
  name: 'meld-cli screenshot',
  desc: 'Manage screenshots in Meld',
  commands: {
    take: {
      desc: 'Take a screenshot'
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

async function screenshotTake (channel) {
  await channel.objects.meld.sendCommand('meld.screenshot')
  return 'Screenshot taken successfully.'
}

export { screenshotHelp, screenshotTake }
