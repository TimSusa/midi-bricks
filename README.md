# midi-bricks-mono

Mono-repo for midi-bricks, its electron app and deployment. See more under packages

## web-demo
https://build-m3ay6b06w.now.sh/

## install

```
yarn && yarn bootstrap
```

## midi-bricks dev

```
yarn dev:midi-bricks
```

## midi-bricks build

```
yarn build:midi-bricks
```

## midi-bricks deployment to now

```
yarn deploy
```

## midi-bricks-electron-app dev

```
yarn dev:midi-bricks-electron
```

## midi-bricks-electron-app build

```
yarn build:midi-bricks-electron
```

## contributing

You can make changes to midi-bricks repo, commit them and publish. Midi-Bricks-Electron will automatically take the latest version from npm.


### publish

```
release patch
yarn publish
```
