"use strict";

GameStates.makeGame = function( game, shared ) {
    // All the different variables at use throughout the program.
    let playerDirection = 'down';

    function quitGame() {
      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
      game.state.start('MainMenu');
    }

    // Restarts the game state whenever a game over or a win occurs.
    function restart() {
      this.music.stop();
      game.state.restart();
    }

    return {
      create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 800, 800);

        // Sets up the music to play.

        // Sets up all of the sounds effects that are in use in the game.

        // Sets up the tilemap for the world and its layers.
        /*
        this.map = game.add.tilemap('tilemap');
        this.map.addTilesetImage('Overworld', 'overworldTiles');
        let groundLayer = this.map.createLayer('GroundLayer');
        this.wallLayer = this.map.createLayer('WallLayer');
        this.map.setCollisionBetween(1, 1000, true, this.wallLayer);
        this.wallLayer.resizeWorld();
        */

        // All of the code to create the player, their physics, and their animations.
        this.player = game.add.sprite(80, 690, 'playerAtlas');
        game.physics.arcade.enable(this.player);
        this.playerSpawn.play();
        this.player.health = 5;
        this.player.body.gravity.y = 0;
        this.player.body.gravity.x = 0;
        this.player.body.velocity.x = 0;
        this.player.animations.add('attackDown', Phaser.Animation.generateFrameNames('attackDown', 1, 4), 10 * playerVelocityConstant, false);
        this.player.animations.add('attackLeft', Phaser.Animation.generateFrameNames('attackLeft', 1, 4), 10 * playerVelocityConstant, false);
        this.player.animations.add('attackRight', Phaser.Animation.generateFrameNames('attackRight', 1, 4), 10 * playerVelocityConstant, false);
        this.player.animations.add('attackUp', Phaser.Animation.generateFrameNames('attackUp', 1, 4), 10 * playerVelocityConstant, false);
        this.player.animations.add('walkUp', Phaser.Animation.generateFrameNames('walkUp', 1, 4), 4 * playerVelocityConstant, true);
        this.player.animations.add('walkLeft', Phaser.Animation.generateFrameNames('walkLeft', 1, 4), 4 * playerVelocityConstant, true);
        this.player.animations.add('walkRight', Phaser.Animation.generateFrameNames('walkRight', 1, 4), 4 * playerVelocityConstant, true);
        this.player.animations.add('walkDown', Phaser.Animation.generateFrameNames('walkDown', 1, 4), 4 * playerVelocityConstant, true);

        // ALl of the code to set up the controls for the plaer.
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

        game.camera.follow(this.player); // Enables camera to follow player.
      },

      update: function () {
        // All of the collision detection.
        game.physics.arcade.collide(this.player, this.wallLayer);

        // Key handling, what happens when a key is pressed:
        if (this.downKey.isDown) {
          this.player.animations.play('walkDown');
          this.player.body.velocity.y = 50;
          this.player.body.velocity.x = 0;
        }
        // If left is pressed, move left, if in air use in-air sprite.
        else if (this.leftKey.isDown) {
          this.player.animations.play('walkLeft');
          this.player.body.velocity.x = -50;
          this.player.body.velocity.y = 0;
        }
        // If right is pressed, move right, if in air use in-air sprite.
        else if (this.rightKey.isDown) {
          this.player.body.velocity.x = 50;
          this.player.body.velocity.y = 0;
          this.player.animations.play('walkRight');
        }
        else if (this.upKey.isDown) {
          this.player.body.velocity.y = -50;
          this.player.body.velocity.x = 0;
          this.player.animations.play('walkUp');
        }
        // Otherwise the player is idle.
        else {
          this.player.animations.stop(null, true);
          this.player.body.velocity.x = 0;
          this.player.body.velocity.y = 0;
        }
      }
    };
};
