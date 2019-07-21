# MIDI Bricks Electron Application
This application could be started and created for Mac, Win and Linux. 
Please be referred to instructions below.

## Official Webpage and Documentation
https://timsusa.github.io/midi-bricks-mono/

## Download 
https://github.com/TimSusa/midi-bricks-mono/releases

## Run App
We introduced CLI Parameter for setting a initial window size or starting the developer console, optionally:

### Initiial Window-Size
Option: ```--window``` 
Values: x,y,w,h

### Developer Console
Option: ```--dev``` 
Values: none

#### Mac-OSX Example:
``` 
open midi-bricks-electron.app  --args "--window" "300,300,1000,1000" --dev
``` 

#### Win Example
You can edit the alias file, which can be found at your desktop and is generated at installation of midi-bricks. 

``` 
midi-bricks.exe --window 100,200,300,400 --dev
``` 

## Prepare for development
Copy the .env.sample file to .env
This file is used to read out environment variables and it is already added to .gitignore.
You can use this file to add custom api tokens for example.

## Install
``` 
    yarn
``` 
## Development
``` 
    yarn dev
``` 
## Build (Create Mac and Win Versions to find in dist folder, afterwards)
``` 
    yarn build
``` 

## Logging
In production you can observe logs from your operatio system.

### MacOSX:
  ```
  cd ~/Library/Logs/MIDI-Bricks && tail -f log.log
  ```

### Windows
  ```
  %USERPROFILE%\AppData\Roaming\MIDI-Bricks\log.log
  ```

### Linux
  ```
  cd ~/.config/MIDI-Bricks && tail -f log.log
  ```

## E2E Tests
You can use either the auto-mode, which starts all jobs automatically. Howevery, issues arose, so you can just start the CI-Mode via:

```
cd packages/midi-bricks-electron && yarn dev && yarn test-e2e
```

# Thanks
Thanks to the people, who made react, redux, material-ui and big thanks to my friend Henrik Wenz (https://github.com/HaNdTriX), who made electron functionality available. And nice big greetz to my friend Alec Troniq (http://alec-troniq.com/), who gave me the right hints, to build up all this stuff, using this for his live performances.

## Support on Beerpay
Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/TimSusa/midi-bricks-mono/badge.svg)](https://beerpay.io/TimSusa/midi-bricks-mono)
[![Beerpay](https://beerpay.io/TimSusa/midi-bricks-mono/make-wish.svg)](https://beerpay.io/TimSusa/midi-bricks-mono)
