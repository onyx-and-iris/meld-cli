function recordScreenshot(channel) {
  return new Promise((resolve, reject) => {
    channel.objects.meld.sendCommand('meld.screenshot').then(() => {
      resolve('Screenshot command sent successfully.')
    }).catch((err) => {
      reject(err)
    })
  })
}

export { recordScreenshot }