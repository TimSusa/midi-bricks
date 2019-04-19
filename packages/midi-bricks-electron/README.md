# midi-bricks-electron

Special thanks to https://github.com/HaNdTriX for establishing this!

# Download 
Mac: https://drive.google.com/open?id=19D6T4Td05QMgwBXm7jxQDA2fkzrjAQaw

Win: https://drive.google.com/open?id=1KzzS7MhAz9ErCxirokNhpX61-Aj_ixtN

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
## E2E Tests
You can use either the auto-mode, which starts all jobs automatically. Howevery, issues arose, so you can just start the CI-Mode via:

```
cd packages/midi-bricks-electron && yarn dev && yarn test-e2e
```

## Support on Beerpay
Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/TimSusa/midi-bricks-mono/badge.svg)](https://beerpay.io/TimSusa/midi-bricks-mono)
[![Beerpay](https://beerpay.io/TimSusa/midi-bricks-mono/make-wish.svg)](https://beerpay.io/TimSusa/midi-bricks-mono)
