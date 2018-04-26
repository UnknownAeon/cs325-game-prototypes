"use strict";

GameStates.makeGame = function(game, shared) {
  // All the globals needed for all the different helper functions.
  var jumpTimer = 0; // Used to make sure jumping can only occur when on ground.
  var music = null;

  function quitGame() {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    music.stop();
    game.state.start('MainMenu');
  }

  // If player loses all health or touches a killing tile, player is killed.
  function playerDeath(player, cause) {
    this.player.kill();
  }

  return {
    create: function () {
      // Sets up all the requirements of the game world.
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.stage.backgroundColor = "ffffff";

      // Sets up all of the sounds and music.
      music = game.add.audio('mainMusic');
			music.loop = true;
			music.volume = .3;
		 	music.play();

      // Add the tilemap to the game.
      this.map = game.add.tilemap('level');
      this.map.addTilesetImage('tiles', 'tiles');
      // Sets up the different layers of the map for interaction.
      this.deathLayer = this.map.createLayer('DeathLayer'); // invisible layer for falling in pits.
      this.deathLayer.visible = false;
      this.groundLayer = this.map.createLayer('GroundLayer');
      let backgroundLayer = this.map.createLayer('BackgroundLayer');
      // Sets up collision detection for the different map layers.
      this.map.setCollisionBetween(1, 100, true, this.groundLayer);
      this.map.setCollisionBetween(1, 100, true, this.deathLayer);
      this.groundLayer.resizeWorld();

      // Sets up the player and everything they need.
      this.player = game.add.sprite(80, 400, 'player');
      this.player.scale.setTo(1,1);
      this.player.health = 4;
      // Sets up player physics.
      game.physics.arcade.enable(this.player);
      this.player.body.gravity.y = 600;
      this.player.body.velocity.x = 100;
      // Sets up the player animations.
      this.player.animations.add('idle', [0,1], 3, true);
      this.player.animations.add('right', [2,3,4,5], 10, true);
      this.player.animations.add('left', [6,7,8,9], 10, true);
      this.player.animations.add('jumpRight', [10], 1, true);
      this.player.animations.add('jumpLeft', [11], 1, true);
      this.player.animations.play('idle');

      // Sets up the HUD.
      this.HUD = game.add.group();
      this.HUD.fixedToCamera = true;
      this.waterFrame = game.add.sprite(5, 10, 'water_frame');
      this.HUD.add(this.waterFrame);
      this.waterBar = game.add.sprite(8, 13, 'water_bar');
      this.HUD.add(this.waterBar);
      this.originalWidth = this.waterBar.width;

      // ALl of the code to set up the controls for the plaer.
      this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
      this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
      this.actionKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

      game.camera.follow(this.player); // Enables camera to follow player.
    },

    update: function () {
      // Enables the collision between the player, layers, and items.
      // Also sets up the callback function for collision.
      game.physics.arcade.collide(this.player, this.groundLayer);
      game.physics.arcade.collide(this.player, this.deathLayer, playerDeath, null, this);

      // Key handling, what happens when a key is pressed:
      // If left is pressed, move left, if in air use in-air sprite.
      if (this.upKey.isDown && game.time.now > jumpTimer) {
        this.player.body.velocity.y = -400;
        jumpTimer = game.time.now + 750;
      }
      // If right is pressed, move right, if in air use in-air sprite.
      else if (this.rightKey.isDown) {
        this.player.body.velocity.x = 100;
        this.player.animations.play('right');
      }
      else if (this.leftKey.isDown) {
        this.player.body.velocity.x = -100;
        this.player.animations.play('left');
      }
      // Otherwise the player is idle.
      else {
        //this.player.animations.stop(null, true);
        this.player.body.velocity.x = 0;
        this.player.animations.play('idle');
      }
    }
  };
};
