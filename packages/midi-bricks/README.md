
# Midi-Bricks
Simple sliders or buttons, which send MIDI Messages to the MIDI-Device you wish. The main feature is, that you are able to select a MIDI driver for each different unit. Furthermore, you can drag and drop, resize your elements as free as you like. Just build your own MIDI controller touch layout.

# Feature Set:
- Your are free to touch more than one slider or button at the same time
- You are free to drag/drop or resize every slider, button or label
- You are free to select any midi driver for every slider or button
- You can switch between layouts
- You can jump between pages
- You are free to save or load your own layout from file
- You can change between two different skins: 'dark' or 'light'
- Your are free to trigger more than just one midi-note or cc value for every slider or button
- You can change background color or font color, even for activated state via color picker
- You can listen for midi notes for every slider or button, which will change activated/not activated state color
- You have keyboard shortcuts available for: 'change to layout mode', 'show settings', 'compact vertical', 'Disable auto-arrange-mode'

- You can have offline mode by installing cross plattform application on your operating system(mac, win): https://github.com/TimSusa/electron-example-midi-sliders

Demo: https://midi-sliders.herokuapp.com/

# Run
```
npm i
npm start
```

# Build for prd
```
npm run build
```

# Restrictions
This application only works with Chrome Browsers. If browser will ask you for permissions, to take over midi, give it to him! There is no security hole there, so do not care about that. If you make use of the electron-installer, this will be no issue for you. Additionaly, you have to have some midi-drivers preconfigured. 

# Love
All this was made with LOVE!

# Thanks
Thanks to the people, who made react, redux, material-ui and big thanks to my friend Henrik Wenz (https://github.com/HaNdTriX), who made electron functionality available. And nice big greetz to my friend Alec Troniq (http://alec-troniq.com/), who gave me the right hints, to build up all this stuff, using this for his live performances.
