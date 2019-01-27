# midi-bricks-mono

Mono-Repository for midi-bricks, its electron app and deployment. See more under packages

## Demo

https://build-7ws1wlbt3.now.sh

## Installation

```
yarn && yarn bootstrap
```

## Run Midi-Bricks-Webapp locally

```
yarn dev:midi-bricks
```

## Build Midi-Bricks-Webapp

```
yarn build:midi-bricks
```

## Deploy Midi-Bricks-Webapp to now

```
yarn deploy
```

## Run Midi-Bricks-Electron-App locally

```
yarn dev:midi-bricks-electron
```

## Build Midi-Bricks-Electron-App

```
yarn build:midi-bricks-electron
```

## Contributing

You can make changes to midi-bricks repo, commit them and publish. Midi-Bricks-Electron will automatically take the latest version from npm.


### Publish

```
release patch
yarn publish
```
