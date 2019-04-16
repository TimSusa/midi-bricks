# Midi-Bricks-Mono-Repository

This is a mono-repository for midi-bricks, its electron app and deployment. 

## Live-Web-Demo
https://midi-bricks.timsusa.now.sh

## More Help
More help can be found in echt sub project folder´s README.md, 
which you can find under packages/. 
In order to get information about building an executable
for your OS please be refered to the midi-bricks-electron folder.

## Bootstrapping the Monorepo:

```
yarn && yarn bootstrap
```

# Core App
The core sources are stemming from midi-bricks folder, which is a standalone webapp.
Furthermore, this one ist deployed to the great guys from https://zeit.co/now. 

## Midi-Bricks-Webapp: Start Development

```
yarn dev:midi-bricks
```

## Midi-Bricks-Webapp: Build for Production

```
yarn build:midi-bricks
```

# Electron App
The core web app will be copied into the electron ecosystem. 
Further code for configuration, especially ```electron.js```,
can be found in its public folder. 


## Midi-Bricks-Electron-App: Start Development
```
yarn dev:midi-bricks-electron
```

## Midi-bricks-electron-app build

```
yarn build:midi-bricks-electron
```

## Contributing
Please consider to create a PR with or without any issue. 
I will get back to you, asap.

