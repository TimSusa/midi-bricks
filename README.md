# midi-bricks-mono

Mono-Repository for midi-bricks, its electron app and deployment. See more under packages

## Demo

https://build-7ws1wlbt3.now.sh

## Installation

```
npm i -g lerna
lerna bootstrap
```

## Run Midi-Bricks locally

```
cd packages/midi-bricks
yarn start
```

## Build Midi-Bricks

```
cd packages/midi-bricks
yarn build
```

## Deploy to now

```
cd packages/midi-bricks
yarn deploy-now
```

## Run Midi-Bricks-Electron-App locally

```
cd packages/midi-bricks-electron
yarn dev
```

## Build Midi-Bricks-Electron-App

```
cd packages/midi-bricks-electron
yarn build
```

## Contributing

You can make changes to midi-bricks repo, commit them and publish. Midi-Bricks-Electron will automatically take the latest version from npm.

### Development Mode

```
cd packages/midi-bricks
yarn start
```

### Publish

```
cd packages/midi-bricks
release patch
npm publish or lerna publish
```
