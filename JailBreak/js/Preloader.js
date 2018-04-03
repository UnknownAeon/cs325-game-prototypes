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
	    preloadBar = game.add.sprite(200, 350, 'preloaderBar');

	    //	This sets the preloadBar sprite as a loader sprite.
	    //	What that does is automatically crop the sprite from 0 to full-width
	    //	as the files below are loaded in.
	    game.load.setPreloadSprite(preloadBar);

	    //	Here we load the rest of the assets our game needs.

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
