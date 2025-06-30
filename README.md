# meld-cli

A command line interface for Meld Studio WebChannel API

[![Code Style](https://img.shields.io/badge/code_style-standard-violet.svg)](https://github.com/standardrb/standard)

---

# Requirements

-   [Meld Studio](https://meldstudio.co/)
-   I'm not sure which versions of node this works with but it was created with v24.3.0

# Installation

```console
npm i -g @onyx-and-iris/meld-cli
```

# Configuration

### Flags

-   --host/-H: Host address for the Meld server
-   --port/-P: Port number for the Meld server

### Environment Variables

Load the following values from your environment:

```bash
MELD_CLI_HOST=localhost
MELD_CLI_PORT=13376
```

### Commands

#### Scene

-   list: List all scenes

```console
meld-cli scene list
```

-   switch: Switch to a scene by name
    - args: sceneName

```console
meld-cli scene switch "My Scene"
```

-   current: Show the current scene

```console
meld-cli scene current
```

#### Audio

-   mute: Mute the audio
    - args: audioName

```console
meld-cli audio mute "Mic"
```

-   unmute: Unmute the audio
    - args: audioName

```console
meld-cli audio unmute "Mic"
```

-   toggle: Toggle audio mute state
    - args: audioName

```console
meld-cli audio toggle "Mic"
```

-   status: Show current audio status
    - args: audioName

```console
meld-cli audio status "Mic"
```

#### Stream

-   start: Start streaming

```console
meld-cli stream start
```

-   stop: Stop streaming

```console
meld-cli stream stop
```

-   status: Show the current streaming status

```console
meld-cli stream status
```

#### Record

-   start: Start recording

```console
meld-cli record start
```

-   stop: Stop recording

```console
meld-cli record stop
```

-   status: Show the current recording status

```console
meld-cli record status
```

## Special Thanks

-   [Meld] for providing the [WebChannel API](https://github.com/MeldStudio/streamdeck/blob/main/WebChannelAPI.md) on which this CLI depends.

## License

`meld-cli` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
