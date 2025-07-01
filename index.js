#!/usr/bin/env node

import { QWebChannel } from 'qwebchannel'
import WebSocket from 'ws'

import cli from './utils/cli.js'
import { sceneHelp, sceneList, sceneSwitch, sceneCurrent } from './utils/scene.js'
import { audioHelp, audioList, audioMute, audioUnmute, audioToggle, audioStatus } from './utils/audio.js'
import { streamHelp, streamStart, streamStop, streamToggle, streamStatus } from './utils/stream.js'
import { recordHelp, recordStart, recordStop, recordToggle, recordStatus } from './utils/record.js'
import { clipHelp, saveClip } from './utils/clip.js'
import { screenshotHelp, takeScreenshot } from './utils/screenshot.js'

const input = cli.input
const flags = cli.flags

const address = flags.host ?? process.env.MELD_CLI_HOST ?? 'localhost'
const port = flags.port ?? process.env.MELD_CLI_PORT ?? 13376

const socket = new WebSocket(`ws://${address}:${port}`)

/**
 * Print help information.
 * @param {string} helpText 
 */
function printHelp(helpText) {
  console.log(helpText)
  process.exit(0)
}

/**
 * Helper to wrap QWebChannel usage and handle promise-based command execution.
 * @param {WebSocket} socket - The websocket instance.
 * @param {function} fn - The function to execute with the channel.
 */
function withChannel(socket, fn) {
  new QWebChannel(socket, function (channel) {
    fn(channel)
      .then((result) => {
        if (typeof result === 'object' && result !== null && typeof result.toString === 'function') {
          console.log(result.toString())
        } else {
          if (result !== undefined) {
            console.log(result)
          }
        }
        socket.close()
        process.exit(0)
      })
      .catch((err) => {
        console.error(`${err}`)
        socket.close()
        process.exit(1)
      })
  })
}

socket.onopen = function () {
  (() => {
    try {
      const command = input[0]
      const helpMap = {
        scene: sceneHelp,
        audio: audioHelp,
        stream: streamHelp,
        record: recordHelp,
        clip: clipHelp,
        screenshot: screenshotHelp
      }

      if (flags.help && helpMap[command]) {
        printHelp(helpMap[command])
      }

      if (command === 'scene') {
        const [sceneCommand, ...sceneArguments] = input.slice(1)
        switch (sceneCommand) {
          case 'list':
            withChannel(socket, (channel) => sceneList(channel, flags.id))
            break
          case 'switch':
            if (!sceneArguments[0]) {
              console.error('Error: Scene name is required for the switch command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => sceneSwitch(channel, sceneArguments[0]))
            break
          case 'current':
            withChannel(socket, (channel) => sceneCurrent(channel, flags.id))
            break
          default:
            printHelp(sceneHelp)
        }
      } else if (command === 'audio') {
        const [audioCommand, ...audioArguments] = input.slice(1)
        switch (audioCommand) {
          case 'list':
            withChannel(socket, (channel) => audioList(channel, flags.id))
            break
          case 'mute':
            if (!audioArguments[0]) {
              console.error('Error: Audio name is required for the mute command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => audioMute(channel, audioArguments[0]))
            break
          case 'unmute':
            if (!audioArguments[0]) {
              console.error('Error: Audio name is required for the unmute command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => audioUnmute(channel, audioArguments[0]))
            break
          case 'toggle':
            if (!audioArguments[0]) {
              console.error('Error: Audio name is required for the toggle command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => audioToggle(channel, audioArguments[0]))
            break
          case 'status':
            if (!audioArguments[0]) {
              console.error('Error: Audio name is required for the status command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => audioStatus(channel, audioArguments[0]))
            break
          default:
            printHelp(audioHelp)
        }
      } else if (command === 'stream') {
        const streamCommand = input[1]
        switch (streamCommand) {
          case 'start':
            withChannel(socket, (channel) => streamStart(channel))
            break
          case 'stop':
            withChannel(socket, (channel) => streamStop(channel))
            break
          case 'toggle':
            withChannel(socket, (channel) => streamToggle(channel))
            break
          case 'status':
            withChannel(socket, (channel) => streamStatus(channel))
            break
          default:
            console.log(streamHelp)
            socket.close()
            process.exit(0)
        }
      } else if (command === 'record') {
        const recordCommand = input[1]
        switch (recordCommand) {
          case 'start':
            withChannel(socket, (channel) => recordStart(channel))
            break
          case 'stop':
            withChannel(socket, (channel) => recordStop(channel))
            break
          case 'toggle':
            withChannel(socket, (channel) => recordToggle(channel))
            break
          case 'status':
            withChannel(socket, (channel) => recordStatus(channel))
            break
          default:
            printHelp(recordHelp)
        }
      } else if (command === 'clip') {
        const clipCommand = input[1]
        if (clipCommand === 'save') {
          withChannel(socket, (channel) => saveClip(channel))
        } else {
          printHelp(clipHelp)
        }
      } else if (command === 'screenshot') {
        const screenshotCommand = input[1]
        if (screenshotCommand === 'take') {
          withChannel(socket, (channel) => takeScreenshot(channel))
        } else {
          printHelp(screenshotHelp)
        }
      } else {
        printHelp(cli.help)
        socket.close()
        process.exit(1)
      }
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  })()
}
