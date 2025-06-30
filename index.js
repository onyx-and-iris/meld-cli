#!/usr/bin/env node

import { QWebChannel } from 'qwebchannel'
import WebSocket from 'ws'

import cli from './utils/cli.js'
import { sceneHelp, sceneList, sceneSwitch, sceneCurrent } from './utils/scene.js'
import { audioHelp, audioMute, audioUnmute, audioToggle, audioStatus } from './utils/audio.js'
import { streamHelp, streamStart, streamStop, streamStatus } from './utils/stream.js'
import { recordHelp, recordStart, recordStop, recordStatus } from './utils/record.js'

const input = cli.input
const flags = cli.flags

const address = flags.host || process.env.MELD_CLI_HOST || 'localhost'
const port = flags.port || process.env.MELD_CLI_PORT || 13376

const socket = new WebSocket(`ws://${address}:${port}`)

socket.onopen = function () {
  (() => {
    let channel
    try {
      if (input[0] === 'scene') {
        if (flags.help) {
          console.log(sceneHelp)
          socket.close()
          process.exit(0)
        }

        const sceneCommand = input[1]
        const sceneArguments = input.slice(2)
        switch (sceneCommand) {
          case 'list':
            channel = new QWebChannel(socket, function (channel) {
              sceneList(channel)
                .then((scenes) => {
                  console.log(scenes)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'switch':
            if (!sceneArguments[0]) {
              console.error('Error: Scene name is required for the switch command.')
              process.exit(1)
            }

            channel = new QWebChannel(socket, function (channel) {
              sceneSwitch(channel, sceneArguments[0])
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'current':
            channel = new QWebChannel(socket, function (channel) {
              sceneCurrent(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
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
          case 'mute':
            if (!audioName) {
              console.error('Error: Audio name is required for the mute command.')
              process.exit(1)
            }

            channel = new QWebChannel(socket, function (channel) {
              audioMute(channel, audioName)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'unmute':
            if (!audioName) {
              console.error('Error: Audio name is required for the unmute command.')
              process.exit(1)
            }

            channel = new QWebChannel(socket, function (channel) {
              audioUnmute(channel, audioName)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'toggle':
            channel = new QWebChannel(socket, function (channel) {
              audioToggle(channel, audioName)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'status':
            channel = new QWebChannel(socket, function (channel) {
              audioStatus(channel, audioName)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
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
            channel = new QWebChannel(socket, function (channel) {
              streamStart(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'stop':
            channel = new QWebChannel(socket, function (channel) {
              streamStop(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'status':
            channel = new QWebChannel(socket, function (channel) {
              streamStatus(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
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
            channel = new QWebChannel(socket, function (channel) {
              recordStart(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'stop':
            channel = new QWebChannel(socket, function (channel) {
              recordStop(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          case 'status':
            channel = new QWebChannel(socket, function (channel) {
              recordStatus(channel)
                .then((message) => {
                  console.log(message)
                  socket.close()
                  process.exit(0)
                })
                .catch((err) => {
                  console.error(`${err}`)
                  socket.close()
                  process.exit(1)
                })
            })
            break
          default:
            console.log(recordHelp)
            socket.close()
            process.exit(0)
        }
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
