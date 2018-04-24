"use strict";

GameStates.makeGame = function(game, shared) {
  // All the globals needed for all the different helper functions.

  function quitGame() {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    music.stop();
    game.state.start('MainMenu');
  }

  return {
    create: function () {
      // Sets up all the requirements of the game world.
      game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    update: function () {

    }
  };
};
