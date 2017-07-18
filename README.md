# Sokoban
#### Clone of the Sokoban game, using Phaser

This is based on a simple Webpack 2.x template for use with Phaser and ES6/2015.

My first full-production game in Phaser, so please forgive me for code issues.

Levels have been developed using the awesome [Tiled Map Editor](http://www.mapeditor.org).  Guidelines for making your own levels are included below.


## Getting Started
You need [Node.js and npm](https://nodejs.org/). 

Clone the repository (or download the ZIP file)

`git clone https://github.com/simonma10/sokoban`

Install dependencies

`npm install`

## Scripts

### Dev

Run a development build...

`npm run dev`

Your ES6 code will be transpiled into ES5 and concatenated into a single file called `bundle.js`.
A sourcemap for your code will also be included (by default `bundle.js.map`).
Phaser modules and dependencies will be transpiled and concatenated into `vendor.bundle.js`, with a sourcemap (`vendor.bundle.js.map`).

Any modification to the files inside the `./src` and `./static` folder will trigger a full page reload.

If you modify the contents of other files, please manually restart the server.


### Prod

Run a production build:

`npm run prod`

Creates production-ready `bundle.js` and `vendor.bundle.js` in the `\dist` folder.


### Test
Run eslint:

`npm run test`


## Using Tiled to create levels

First of all, download and install the [Tiled Map Editor](http://www.mapeditor.org).  It's free to download, but please support the developer.

Currently, Sokoban has a few rules in place:

### Map Format
 - Maps are orthogonal
 - width = 16 tiles
 - height = 16 tiles
 - files should be saved as `soko000.json` - replace the `000` with the actual level number.
 
### Tileset

The tileset I'm using is stored in `static\images\sokoban_tilesheet.png`.  Make sure you add this tilesheet, and ensure it has the same name - `sokoban_tilesheet`



 
### Map Layers
Maps have three layers, to keep things simple, and make it super easy to develop new levels:
1. Background:  ensure this is of type `Tile Layer` and is called `backgroundLayer`.  Nothing interacts with this layer, so you can include whatever tiles you want!
2. Blocks: make sure this is of type `Tile Layer` and is called `blockingLayer`.  This is the layer with the walls:  the player and the crates cannot move through these.
3. Objects: make sure this is of type `Object Layer` and is called `objectLayer`.  More information about this layer in the next section

### Map Objects
Sokoban expects three types of objects for the game to work properly:
1. Player Object.  This is just a placeholder, so may not look the same in the game (the actual spritesheet used is `static\images\player.png`). However, to link up this object with the sprite in the game, make sure the `Type` is set to `player`, and add a custom property `sprite` with the value `playerSprite`.
2. Crates.  Same as Player - make sure they are type `crate`, with custom property `sprite` = `crateSprite`.
3. Parking Spots.  Same again, make sure they are type `spot`, with custom property `sprite` = `spotSprite`.

## Contributing

Please report any bugs or add requests on [Github Issues](https://github.com/simonma10/sokoban/issues).


## License

This project is released under the MIT License (even though it should be spelt 'Licence').

## Credits

Respect to the owners of the following projects:

https://github.com/lean/phaser-es6-webpack.git

https://github.com/belohlavek/phaser-es6-boilerplate

https://github.com/cstuncsik/phaser-es6-demo
