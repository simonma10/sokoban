# Sokoban
#### Clone of the Sokoban game, using Phaser

This is a basic Webpack 2.x template for use with Phaser and ES6/2015.

It is very much a work in progress!!

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




## Contributing

Please report any bugs or add requests on [Github Issues](https://github.com/simonma10/sokoban/issues).


## License

This project is released under the MIT License (even though it should be spelt 'Licence').

## Credits

Respect to the owners of the following projects:

https://github.com/lean/phaser-es6-webpack.git

https://github.com/belohlavek/phaser-es6-boilerplate

https://github.com/cstuncsik/phaser-es6-demo
