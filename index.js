#!/usr/bin/env node

import { QWebChannel } from 'qwebchannel'
import WebSocket from 'ws'

import cli from './utils/cli.js'
import { sceneHelp, sceneList, sceneSwitch, sceneCurrent } from './utils/scene.js'
import { audioHelp, audioList, audioMute, audioUnmute, audioToggle, audioStatus } from './utils/audio.js'
import { streamHelp, streamStart, streamStop, streamToggle, streamStatus } from './utils/stream.js'
import { recordHelp, recordStart, recordStop, recordToggle, recordStatus } from './utils/record.js'
import { recordClip } from './utils/clip.js'
import { recordScreenshot } from './utils/screenshot.js'

const input = cli.input
const flags = cli.flags

const address = flags.host ?? process.env.MELD_CLI_HOST ?? 'localhost'
const port = flags.port ?? process.env.MELD_CLI_PORT ?? 13376

const socket = new WebSocket(`ws://${address}:${port}`)

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
      if (input[0] === 'scene') {
        if (flags.help) {
          console.log(sceneHelp)
          socket.close()
          process.exit(0)
        }

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
            console.log(sceneHelp)
            socket.close()
            process.exit(0)
        }
      } else if (input[0] === 'audio') {
        if (flags.help) {
          console.log(audioHelp)
          socket.close()
          process.exit(0)
        }

        const audioCommand = input[1]
        const audioName = input[2]
        switch (audioCommand) {
          case 'list':
            withChannel(socket, (channel) => audioList(channel, flags.id))
            break
          case 'mute':
            if (!audioName) {
              console.error('Error: Audio name is required for the mute command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => audioMute(channel, audioName))
            break
          case 'unmute':
            if (!audioName) {
              console.error('Error: Audio name is required for the unmute command.')
              process.exit(1)
            }
            withChannel(socket, (channel) => audioUnmute(channel, audioName))
            break
          case 'toggle':
            withChannel(socket, (channel) => audioToggle(channel, audioName))
            break
          case 'status':
            withChannel(socket, (channel) => audioStatus(channel, audioName))
            break
          default:
            console.log(audioHelp)
            socket.close()
            process.exit(0)
        }
      } else if (input[0] === 'stream') {
        if (flags.help) {
          console.log(streamHelp)
          socket.close()
          process.exit(0)
        }

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
      } else if (input[0] === 'record') {
        if (flags.help) {
          console.log(recordHelp)
          socket.close()
          process.exit(0)
        }

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
            console.log(recordHelp)
            socket.close()
            process.exit(0)
        }
      } else if (input[0] === 'clip') {
        if (flags.help) {
          console.log(`usage: meld-cli clip`)
          socket.close()
          process.exit(0)
        }

        withChannel(socket, (channel) => recordClip(channel))
      } else if (input[0] === 'screenshot') {
        if (flags.help) {
          console.log(`usage: meld-cli screenshot`)
          socket.close()
          process.exit(0)
        }

        withChannel(socket, (channel) => recordScreenshot(channel))
      } else {
        console.log('Unknown command. Use meld-cli --help for available commands.')
        socket.close()
        process.exit(0)
      }
    } catch (error) {
      console.error('Error handling CLI flags:', error)
    }
  })()
}
