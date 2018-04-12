"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;
	var ready = false;

	return {
  	preload: function () {
			//	These are the assets we loaded in Boot.js
	    //	A background and a loading progress bar
	    background = game.add.sprite(0, 0, 'titleBackground');
			let preloadBarFrame = game.add.sprite(0, 0, 'loadingBarFrame');
			background.height = 600;
	    preloadBar = game.add.sprite(200, 350, 'preloaderBar');

	    //	This sets the preloadBar sprite as a loader sprite.
	    //	What that does is automatically crop the sprite from 0 to full-width
	    //	as the files below are loaded in.
	   	game.load.setPreloadSprite(preloadBar);

	    //	Here we load the rest of the assets our game needs.
			// Main Menu stuffs
			game.load.audio('titleMusic', 'assets/audio/music/high_dungeon.mp3');
			game.load.audio('button', 'assets/audio/sounds/button.wav');
			game.load.image('title', 'assets/images/title.png');
			game.load.image('buttonFrame', 'assets/images/button_frame.png');
			game.load.spritesheet('startButton', 'assets/images/start_button.png', 257, 48);
			game.load.spritesheet('instructionsButton', 'assets/images/instructions_button.png', 257, 48);
			game.load.spritesheet('retryButton', 'assets/images/retry_button.png', 257, 48);
			game.load.spritesheet('continueButton', 'assets/images/continue_button.png', 257, 48);
			game.load.spritesheet('closeButton', 'assets/images/close_button.png', 257, 48);
			// Instructions Stuffs
			game.load.image('instructions1', 'assets/images/instructions1.png');
			game.load.image('instructions2', 'assets/images/instructions2.png');
			game.load.image('instructions3', 'assets/images/instructions3.png');
			// Game Stuffs
			game.load.audio('music', 'assets/audio/music/the_dungeon.mp3');
			game.load.atlas('player', 'assets/sprites/criminal.png', 'assets/sprites/criminal.json');
			game.load.atlas('guardLeftRight', 'assets/sprites/guardLeftRight.png', 'assets/sprites/guardLeftRight.json');
			game.load.atlas('guardUpDown', 'assets/sprites/guardUpDown.png', 'assets/sprites/guardUpDown.json');
			game.load.atlas('wizardGuard', 'assets/sprites/wizardGuard.png', 'assets/sprites/wizardGuard.json');
			game.load.image('magicka_frame', 'assets/images/magicka_frame.png');
			game.load.image('magicka_lock', 'assets/images/magicka_lock.png');
			game.load.image('magicka_bar', 'assets/images/magicka_bar.png');
			// Sound Stuffs
			game.load.audio('key', 'assets/audio/sounds/key.wav');
			game.load.audio('keyhole', 'assets/audio/sounds/keyhole.wav');
			game.load.audio('invisibility', 'assets/audio/sounds/invisibility.wav');
			game.load.audio('alert', 'assets/audio/sounds/metal_gear_solid_alert.mp3');
			game.load.audio('portal', 'assets/audio/sounds/portal.wav');
			game.load.audio('vial', 'assets/audio/sounds/vial.wav');
			game.load.audio('magicLock', 'assets/audio/sounds/magicLock.wav');
			// All the levels - just one for now!
			game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.tilemap('level2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.tilemap('level3', 'assets/levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('tiles', 'assets/sprites/tiles.png');
			game.load.image('door', 'assets/sprites/door.png');
			game.load.image('door2', 'assets/sprites/door2.png');
			game.load.image('door3', 'assets/sprites/door3.png');
			game.load.image('wizardCircle', 'assets/sprites/wizardCircle.png');
			game.load.spritesheet('bluePortal', 'assets/sprites/bluePortal.png', 32, 32);
			game.load.spritesheet('redPortal', 'assets/sprites/redPortal.png', 32, 32);
			game.load.spritesheet('greenPortal', 'assets/sprites/greenPortal.png', 32, 32);
			game.load.spritesheet('orangePortal', 'assets/sprites/orangePortal.png', 32, 32);
			game.load.image('exitDoor', 'assets/sprites/exit_door.png');
			game.load.spritesheet('key', 'assets/sprites/key.png', 16, 16);
			game.load.spritesheet('vial', 'assets/sprites/vial.png', 16, 16);

    },

    create: function () {
	    //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
	   preloadBar.cropEnabled = false;
    },

    update: function () {
	   if (game.cache.isSoundDecoded('titleMusic') && ready == false) {
     	ready = true;
	    game.state.start('MainMenu');
	   }
    }
  };
};
