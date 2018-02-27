"use strict";

GameStates.makePreloader = function( game ) {
	var background = null;
	var preloadBar = null;
	var ready = false;

  return {
    preload: function () {
    	//	These are the assets we loaded in Boot.js
      //	A nice sparkly background and a loading progress bar
      let background = game.add.sprite(0, 0, 'titleBackground');
      let preloadBarFrame = game.add.sprite(0, 0, 'loadingBarFrame');
			preloadBarFrame.width = 800;
			preloadBarFrame.height = 600;
			preloadBar = game.add.sprite(0, 0, 'loadingBar');
			preloadBar.width = 800;
			preloadBar.height = 600;

      //	This sets the preloadBar sprite as a loader sprite.
      //	What that does is automatically crop the sprite from 0 to full-width
      //	as the files below are loaded in.
      game.load.setPreloadSprite(preloadBar);

      //	Here we load the rest of the assets our game needs.
      //	As this is just a Project Template I've not provided these assets, swap them for your own.
      game.load.audio('titleMusic', 'assets/audio/music/ice_cream_sandwich.mp3');
			game.load.image('background', 'assets/images/background.png');
			game.load.image('buttonFrame', 'assets/images/button_frame.png');
			game.load.image('title', 'assets/images/title.png');
			game.load.spritesheet('buttons', 'assets/images/buttons.png', 257, 48);
			game.load.spritesheet('hourglass', 'assets/sprites/hourglass.png', 32, 32);
			game.load.atlas('penguins', 'assets/sprites/penguins.png', 'assets/sprites/penguins.json');
    },

    create: function () {
	    //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
	    preloadBar.cropEnabled = false;
    },

    update: function () {
			// Waits for music to be decoded entirely before the game can begin.
      if (game.cache.isSoundDecoded('titleMusic') && ready == false) {
        ready = true;
        game.state.start('MainMenu');
      }
    }
  };
};
