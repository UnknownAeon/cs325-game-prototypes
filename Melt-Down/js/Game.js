"use strict";

GameStates.makeGame = function(game, shared) {
  // All the globals needed for all the different helper functions.
  var music = null;
  var jumpTimer = 0; // Used to make sure jumping can only occur when on ground.
  var slide = 'none';
  var score = 0;

  function quitGame() {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    game.state.start('MainMenu');
  }

  // Prepares a block to be destroyed after the player walks over it.
  function destroyBlock(player, block) {
    // If the block isn't queued for destruction or the player didn't touch its top, then it doesn't break.
    // If both conditions are met, block is queued to break.
    if (block.queued == false && player.body.touching.down == true) {
      block.queued = true;
      // Creates the timer.
      let breakTimer = game.time.create();
      let breakBlock = breakTimer.add(Phaser.Timer.SECOND, removeBlock, this, block);
      breakTimer.start();
      // Starts the breaking animation.
      block.animations.play('break');
    }
  }
  // Destroys the block at the end of its timer and increments the player's score.
  function removeBlock(block) {
    block.kill();
    score += 10;
  }

  return {
    create: function () {
      // Sets up all the requirements of the game world.
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.setBoundsToWorld();
      game.world.setBounds(0, 0, 800, 1000);

      // Defines everything that the game state needs.
      // First all the non player/enemy/map assets.
      // Music stuffs.
      music = game.add.audio('titleMusic');
			music.loop = true;
			music.volume = .3;
      music.play();
      // Sound effects stuffs.
      this.jump = game.add.audio('jump');
      this.jump.volume = .3;
      // Background image
      let background = game.add.sprite(0, 0, 'background');

      // Add the tilemap to the game.
      this.map = game.add.tilemap('level1');
      this.map.addTilesetImage('water', 'water');
      this.map.addTilesetImage('spawnTiles', 'spawnTiles');

      // Sets up the different layers of the map for interaction.
      // Water layer that ends the level on collision with the player -> NEED TO ADD.
      this.waterLayer = this.map.createLayer('WaterLayer');
      this.map.setCollisionBetween(1, 100, true, this.waterLayer);
      // Takes the ice block object layer and converts them all into sprites that can be interacted with.
      // This allows extra control beyond a tile, and allows us to add animations and destroy the tiles.
      this.iceBlocks = game.add.physicsGroup();
      this.map.createFromObjects('IceLayer', 'ice', 'iceBlock', 0, true, false, this.iceBlocks);
      this.iceBlocks.forEach(block => {
        game.physics.enable(block, Phaser.Physics.ARCADE);
        block.body.immovable = true;
        block.body.allowGravity = false;
        block.animations.add('break', [0, 1, 2, 3], 5, false);
        block.queued = false; // Extra variable used to maintain if the block is queued to break.
      });
      // Creates the player character sprite.
      this.playerGroup = game.add.physicsGroup();
      // We create the player sprite from an object tile from the tile map.
      this.map.createFromObjects('PlayerSpawn', 'player', 'penguins', 'sprite1', true, false, this.playerGroup);
      this.playerGroup.forEach(player => {
        // Since there is only the one player sprite, we can just direct assign it.
        // Placing it at the location of the object spawn tile.
        this.player = game.add.sprite(player.x, player.y, 'penguins');
        player.kill(); // Destroys the object spawn tile - don't want some stretched penguin at the top of the screen!
      });
      // Sets up all of the details for the player.
      game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.body.gravity.y = 600;
      this.player.body.gravity.x = 20;
      this.player.body.velocity.x = 0;
      // Sets up the player animations.
      this.player.animations.add('idle', ['sprite1'], 0, true);
      this.player.animations.add('walkLeft', ['sprite13', 'sprite17', 'sprite13', 'sprite18'], 4, true);
      this.player.animations.add('walkRight', ['sprite25', 'sprite29', 'sprite25', 'sprite30'], 4, true);
      this.player.animations.play('idle');
      game.camera.follow(this.player); // Enables camera to follow player

      this.slideTimer = game.time.create(); // Timer for the player sliding on blocks.

      this.cursors = game.input.keyboard.createCursorKeys(); // Sets up arrow key bindings.
    },

    update: function () {
      game.physics.arcade.overlap(this.player, this.waterLayer); // Will be end level function associated.

      // Collision detection for all of the ice blocks.
      this.iceBlocks.forEach(block => {
        game.physics.arcade.collide(this.player, block, destroyBlock, null, this);
      });

      // Checks for input from key bindings, moves player accordingly.
      // If up is pressed, and the player is on the floor, then jump.
      if (this.cursors.up.isDown && this.player.body.touching.down == true && game.time.now > jumpTimer) {
        this.player.body.velocity.y = -300;
        jumpTimer = game.time.now + 750;
        this.jump.play();
      }
      // If left is pressed, move left.
      else if(this.cursors.left.isDown) {
        slide = 'left'
        this.slideTimer.stop();
        this.player.body.velocity.x = -100;
        this.player.animations.play('walkLeft');
        // this.footstep.play();
      }
      // If right is pressed, move right.
      else if(this.cursors.right.isDown) {
        slide = 'right'
        this.slideTimer.stop();
        this.player.body.velocity.x = 100;
        this.player.animations.play('walkRight');
      }
      // Otherwise the player is idle.
      else {
        this.player.body.velocity.x = 0;
        if (this.player.body.touching.down == true) {
          var stopSlide = function() {
            this.player.body.velocity.x = 0;
            this.player.animations.play('idle');
          };
          // If the player has been moving then the player should slide on the ice!
          // Slides left or right depending on direction through use of a timer and a lower velocity.
          if (slide == 'right') {
            this.player.body.velocity.x = 75;
            let slideRight = this.slideTimer.add(Phaser.Timer.SECOND * 2, stopSlide, this);
            this.slideTimer.start();
          }
          else if (slide == 'left') {
            this.player.body.velocity.x = -75;
            let slideRight = this.slideTimer.add(Phaser.Timer.SECOND * 2, stopSlide, this);
            this.slideTimer.start();
          }
        }
      }
    }
  };
};
