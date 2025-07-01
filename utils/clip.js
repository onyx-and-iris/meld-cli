function recordClip(channel) {
  return new Promise((resolve, reject) => {
    channel.objects.meld.sendCommand('meld.recordClip').then(() => {
      resolve('Clip command sent successfully.')
    }).catch((err) => {
      reject(err)
    })
  })
}

export { recordClip }
