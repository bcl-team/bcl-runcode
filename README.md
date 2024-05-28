[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# RunCode Resource for FiveM devs

## Overview

RunCode is a comprehensive resource for FiveM devs that introduces an in-game code editor, empowering developers to write, edit, and execute code directly within the game environment. Supporting both Lua and JavaScript runtimes, RunCode enhances the coding experience with rich editing features, making it a versatile tool for real-time development and debugging.

## Features

- **In-Game Code Editor**: Seamlessly write and edit code without restarting the resource.
- **Dual Language Support**: Supports both Lua and JavaScript runtimes, catering to diverse scripting needs.
- **Rich Editing Capabilities**: Includes syntax highlighting, auto-completion, error detection, and more for an enhanced coding experience.
- **Real-Time Execution**: Execute scripts instantly and see the results in real time, facilitating rapid development and testing.
- **Server and Client Code Execution**: Execute both server-side and client-side scripts for comprehensive testing and development.
- **User-Friendly Interface**: Intuitive and accessible UI designed for both novice and experienced developers.

## Installation

1. **Download the Resource**: Obtain the latest version of RunCode from the [GitHub repository](https://github.com/bcl-team/bcl-runcode).
2. **Add to Your Server**: Place the RunCode resource folder into your server’s `resources` directory.
3. **Update Server Config**: Add `start bcl-runcode` to your server configuration file (`server.cfg`).
4. **Restart Server**: Restart your FiveM server to load the new resource.

## Usage

1. **Open the Editor**: Use the assigned keybinding or command to open the RunCode editor in-game.
2. **Write Your Code**: Utilize the editor's features to write and edit your Lua or JavaScript scripts.
3. **Execute Scripts**: Run your code directly within the game and observe the output and effects immediately.
4. **Server and Client Execution**: Choose to execute scripts on the server or client side as needed for thorough testing.

## Contribute

RunCode is an open-source project and we welcome contributions from the community. Visit our [GitHub repository](https://github.com/bcl-team/bcl-runcode) to report issues, suggest features, or submit pull requests.

## Extensions
### These functions/props are injected into both lua and js runtimes
shared helper functions/props
```ts
declare const playerId: number;
declare const playerPed: number;
declare const currentVehicle: number;
declare const lastVehicle: number;
declare const sleep: (ms: number) => Promise<void>;
declare const waitUntil: (predicate: () => boolean, max?: number) => Promise<boolean>;
```

client specific helper functions/props
```ts
declare const serverId: number;
declare const requestModel: (model: string | number) => Promise<void>;
declare const requestAnimDict: (dict: string) => Promise<void>;
```

lua specific helper functions/props
```ts
declare const setTick: (handler: () => any) => TickHandle;
declare const clearTick: (handle: TickHandle) => boolean;
```