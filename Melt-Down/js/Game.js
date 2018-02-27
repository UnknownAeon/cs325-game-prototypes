"use strict";

GameStates.makeGame = function(game, shared) {
  // All the globals needed for all the different helper functions.

  function quitGame() {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    game.state.start('MainMenu');
  }

  return {
    create: function () {
      // Defines everything that the game state needs.
      music = game.add.audio('titleMusic');
			music.loop = true;
			music.volume = .3;
      music.play();

      let background = game.add.sprite(0, 0, 'background');
    },

    update: function () {

    }
  };
};
