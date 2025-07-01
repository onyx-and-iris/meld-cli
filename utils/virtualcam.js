import meowHelp from 'cli-meow-help'

const commands = {
  toggle: {
    desc: 'Toggle the virtual camera on or off'
  }
}

const flags = {
  help: {
    type: 'boolean',
    shortFlag: 'h',
    desc: 'Display help information'
  }
}

const virtualcamHelp = meowHelp({
  name: 'virtualcam',
  flags,
  commands,
  desc: 'Manage virtual camera settings in Meld',
  defaults: false
})

async function virtualcamToggle (channel) {
  await channel.objects.meld.sendCommand('meld.toggleVirtualCameraAction')
  return 'Virtual camera toggled successfully.'
}

export { virtualcamHelp, virtualcamToggle }
