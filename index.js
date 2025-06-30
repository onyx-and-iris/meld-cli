#!/usr/bin/env node

import cli from "./utils/cli.js";
import { sceneHelp, sceneList, sceneSwitch, sceneCurrent } from "./utils/scene.js";
import { audioHelp, audioMute, audioUnmute, audioToggle, audioStatus } from "./utils/audio.js";
import { streamHelp, streamStart, streamStop, streamStatus } from "./utils/stream.js";
import { QWebChannel } from "qwebchannel";


const address = process.env.MELD_CLI_HOST || "localhost";
const port = process.env.MELD_CLI_PORT || 13376;

const input = cli.input;
const flags = cli.flags;

var socket = new WebSocket(`ws://${address}:${port}`);


socket.onopen = function() {
    let channel;
    (() => {
        try {
            switch (input[0]) {
                case "scene":
                    if (flags.help) {
                        console.log(sceneHelp);
                        socket.close();
                        process.exit(0);
                    }

                    const sceneCommand = input[1];
                    switch (sceneCommand) {
                        case "list":
                            channel = new QWebChannel(socket, function (channel) {
                                sceneList(channel)
                                    .then((scenes) => {
                                        if (scenes.length === 0) {
                                            console.log("No scenes found.");
                                        } else {
                                            console.log("Available scenes:");
                                            scenes.forEach(scene => {
                                                console.log(`- ${scene.name} (ID: ${scene.id})`);
                                            });
                                        }
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "switch":
                            const sceneName = input[2];
                            if (!sceneName) {
                                console.error("Error: Scene name is required for the switch command.");
                                process.exit(1);
                            }

                            channel = new QWebChannel(socket, function (channel) {
                                sceneSwitch(channel, sceneName)
                                    .then(() => {
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "current":
                            channel = new QWebChannel(socket, function (channel) {
                                sceneCurrent(channel)
                                    .then((currentScene) => {
                                        if (currentScene) {
                                            console.log(`Current scene: ${currentScene.name} (ID: ${currentScene.id})`);
                                        } else {
                                            console.log("No current scene found.");
                                        }
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        default:
                            console.log(sceneHelp);
                            socket.close();
                            process.exit(0);
                    }
                
                case "audio":
                    if (flags.help) {
                        console.log(audioHelp);
                        socket.close();
                        process.exit(0);
                    }

                    const audioCommand = input[1];
                    const audioName = input[2];
                    switch (audioCommand) {
                        case "mute":
                            if (!audioName) {
                                console.error("Error: Audio name is required for the mute command.");
                                process.exit(1);
                            }

                            channel = new QWebChannel(socket, function (channel) {
                                audioMute(channel, audioName)
                                    .then((message) => {
                                        console.log(message);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "unmute":
                            if (!audioName) {
                                console.error("Error: Audio name is required for the mute command.");
                                process.exit(1);
                            }
                            channel = new QWebChannel(socket, function (channel) {
                                audioUnmute(channel, audioName)
                                    .then((message) => {
                                        console.log(message);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "toggle":
                            channel = new QWebChannel(socket, function (channel) {
                                audioToggle(channel, audioName)
                                    .then((message) => {
                                        console.log(message);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "status":
                            channel = new QWebChannel(socket, function (channel) {
                                audioStatus(channel, audioName)
                                    .then((status) => {
                                        console.log(`${audioName} is ${status ? "muted" : "unmuted"}`);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`Error fetching audio status: ${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        default:
                            console.log(audioHelp);
                            socket.close();
                            process.exit(0);
                    }

                case "stream":
                    if (flags.help) {
                        console.log(streamHelp);
                        socket.close();
                        process.exit(0);
                    }

                    const streamCommand = input[1];
                    switch (streamCommand) {
                        case "start":
                            channel = new QWebChannel(socket, function (channel) {
                                streamStart(channel)
                                    .then((message) => {
                                        console.log(message);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "stop":
                            channel = new QWebChannel(socket, function (channel) {
                                streamStop(channel)
                                    .then((message) => {
                                        console.log(message);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        case "status":
                            channel = new QWebChannel(socket, function (channel) {
                                streamStatus(channel)
                                    .then((isStreaming) => {
                                        console.log(`Streaming is currently ${isStreaming ? "active" : "inactive"}`);
                                        socket.close();
                                        process.exit(0);
                                    })
                                    .catch((err) => {
                                        console.error(`Error fetching stream status: ${err}`);
                                        socket.close();
                                        process.exit(1);
                                    });
                            });
                            break;
                        default:
                            console.log(streamHelp);
                            socket.close();
                            process.exit(0);
                    }
            }
        } catch (error) {
            console.error("Error handling CLI flags:", error);
        }
    })();
};
