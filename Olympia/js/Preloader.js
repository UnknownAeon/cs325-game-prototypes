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
			background.height = 600;
			background.width = 800;
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
			// Main Menu stuff
			game.load.image('title', 'assets/images/title.png');
			game.load.image('buttonFrame', 'assets/images/button_frame.png');
			game.load.image('instructions1', 'assets/images/instructions1.png');
			game.load.image('instructions2', 'assets/images/instructions2.png');
			game.load.image('instructions3', 'assets/images/instructions3.png');
			game.load.spritesheet('buttons', 'assets/images/buttons.png', 257, 48);
			game.load.audio('titleMusic', 'assets/audio/music/artemis.mp3');

			// Game stuff
			game.load.image('background' ,'assets/images/background.png');
			game.load.tilemap('level', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('tiles', 'assets/spritesheets/tiles.png');
			game.load.spritesheet('tiles2', 'assets/spritesheets/tiles.png', 64, 64);
			game.load.audio('mainMusic', 'assets/audio/music/greek_myths.mp3');
			game.load.audio('gemGrab', 'assets/audio/sounds/gem.wav');
			game.load.audio('damage', 'assets/audio/sounds/damage.wav');
			game.load.audio('death', 'assets/audio/sounds/falling.wav');
			game.load.audio('jump', 'assets/audio/sounds/splash.wav');
			game.load.audio('splish', 'assets/audio/sounds/splish.wav');
			game.load.image('water_frame', 'assets/images/water_frame.png');
			game.load.image('water_bar', 'assets/images/water_bar.png');
			game.load.spritesheet('player', 'assets/spritesheets/demigod.png', 64, 64);
			game.load.spritesheet('bat', 'assets/spritesheets/bat.png', 42, 29);
			game.load.spritesheet('waterblast', 'assets/spritesheets/waterblast.png', 16, 16);
			game.load.spritesheet('items', 'assets/spritesheets/items.png', 16, 16);
    },

    create: function () {
	    //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
	    preloadBar.cropEnabled = false;
    },

    update: function () {
			// Waits for music to be decoded entirely before the game can begin.
     if (game.cache.isSoundDecoded('titleMusic') && game.cache.isSoundDecoded('mainMusic') && ready == false) {
        ready = true;
        game.state.start('MainMenu');
     }
    }
  };
};
