# meld-cli

A command line interface for Meld Studio WebChannel API

[![Code Style](https://img.shields.io/badge/code_style-standard-violet.svg)](https://github.com/standard/standard)

---

# Requirements

-   [Meld Studio](https://meldstudio.co/)
-   Tested with node v22.17.0 (lts).

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
    -   flags: 
        -   --id: Display scene IDs

```console
meld-cli scene list

meld-cli scene list --id
```

-   switch: Switch to a scene by name
    - args: sceneName

```console
meld-cli scene switch "My Scene"
```

-   current: Show the current scene
    -   flags: 
        -   --id: Display scene ID

```console
meld-cli scene current

meld-cli scene current --id
```

#### Audio

-   list: List all audio devices
    -   flags: 
        -   --id: Display audio IDs

```console
meld-cli audio list

meld-cli audio list --id
```

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

-   gain: Adjust the gain of a specific audio track by name.
    -   args: audioName gainValue

```console
meld-cli audio gain "System" -12.8
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

-   toggle: Toggle streaming state

```console
meld-cli stream toggle
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

-   toggle: Toggle recording state

```console
meld-cli record toggle
```

-   status: Show the current recording status

```console
meld-cli record status
```

#### Clip

-   save: Save a clip

```console
meld-cli clip save
```

#### Screenshot

-   take: Take a screenshot

```console
meld-cli screenshot take
```

#### Virtual Camera

-   toggle: Toggle the virtual camera on or off

```console
meld-cli virtualcam toggle
```

## Special Thanks

-   Meld team for providing the [WebChannel API](https://github.com/MeldStudio/streamdeck/blob/main/WebChannelAPI.md) on which this CLI depends.

## License

`meld-cli` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
