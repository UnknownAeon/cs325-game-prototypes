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

			// All of the mainmenu stuffs.
      game.load.audio('titleMusic', 'assets/audio/music/ice_cream_sandwich.mp3');
			game.load.image('buttonFrame', 'assets/images/button_frame.png');
			game.load.image('title', 'assets/images/title.png');

			// All the ingame stuffs.
			game.load.image('background', 'assets/images/background.png');
			game.load.image('water', 'assets/sprites/water.png');
			game.load.image('spawnTiles', 'assets/sprites/spawnTiles.png');
			game.load.image('flipDirection', 'assets/sprites/flipDirection.png');
			game.load.image('bear_death', 'assets/sprites/bear_death.png');

			// All the levels.
			game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.tilemap('level2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);

			// All the sprite stuffs.
			game.load.spritesheet('buttons', 'assets/images/buttons.png', 257, 48);
			game.load.spritesheet('hourglass', 'assets/sprites/hourglass.png', 32, 32);
			game.load.spritesheet('iceBlock', 'assets/sprites/ice_block.png', 32, 32);
			game.load.atlas('penguins', 'assets/sprites/penguins.png', 'assets/sprites/penguins.json');
			game.load.atlas('bears', 'assets/sprites/polarbears.png', 'assets/sprites/bears.json');

			// All the level finished stuffs.
			game.load.image('levelComplete', 'assets/images/levelComplete.png');
			game.load.image('levelFailed', 'assets/images/levelFailed.png');
			game.load.image('victory', 'assets/images/victory.png');
			game.load.spritesheet('noStar', 'assets/sprites/noStar.png', 32, 32);
			game.load.spritesheet('star', 'assets/sprites/star.png', 32, 32);

			// All the sound effects stuffs.
			game.load.audio('jump', 'assets/audio/sounds/jump.wav');
			game.load.audio('bearKilled', 'assets/audio/sounds/bear_killed.wav');
			game.load.audio('blockStep', 'assets/audio/sounds/block_step.wav');
			game.load.audio('menuSelect', 'assets/audio/sounds/menu_select.wav');
			game.load.audio('pickup', 'assets/audio/sounds/pickup.wav');
			game.load.audio('playerKilled', 'assets/audio/sounds/player_killed.wav');
			game.load.audio('playerWater', 'assets/audio/sounds/player_water.wav');
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
