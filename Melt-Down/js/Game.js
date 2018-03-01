"use strict";

GameStates.makeGame = function(game, shared) {
  // All the globals needed for all the different helper functions.
  var blockCount = 0; // Used to keep track of how many blocks have been broken.
  var blockTotal = 0; // Used to keep track of how many total blocks there are.
  var currentLevel = 1; // Used to maintain which tile map we are on whenever we reset this state.
  var maxLevel = 2; // Used to keep track of whether or not this is the last level.
  var music = null;
  var levelComplete = false;
  var jumpTimer = 0; // Used to make sure jumping can only occur when on ground.
  var slide = 'none';
  var score = 0;
  var time = 0;

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
      blockCount++;
      this.blockCounter.text = '= ' + blockCount;
      this.blockStep.play();
      block.queued = true;
      // Anon function for block removal.
      // Destroys the block at the end of its timer and increments the player's score.
      var removeBlock = function(block) {
        block.kill();
        score += 10;
        this.scoreCounter.text = 'Score = ' + score;
      }
      // Creates the timer.
      let breakTimer = game.time.create();
      let breakBlock = breakTimer.add(Phaser.Timer.SECOND, removeBlock, this, block);
      breakTimer.start();
      // Starts the breaking animation.
      block.animations.play('break');
    }
  }

  // Ends the level, stops the timer, 'kills' the player.
  // Will display the end result info - win vs lose, restart vs continue.
  function endLevel(player, water) {
    this.playerWater.play();
    player.kill();
    levelComplete = true;
    score += time * 10;
    this.HUD.destroy();
    let rating = null;
    let win = true;
    // Deterines your rating based on your score.
    if (blockCount >= blockTotal * (3 / 4)) rating = 3;
    else if (blockCount >= blockTotal * (1 / 2)) rating = 2;
    else if (blockCount >= blockTotal * (1 / 4)) rating = 1;
    else {
      rating = 0;
      win = false;
    }
    // Displays score.
    displayScore(rating, win);
  }

  // Displays the score in a nice graphic. Gives a button for retry or for moving on.
  function displayScore(rating, win) {
    let textStyle = {
      font: "normal 38px Tahoma",
      fill: '#ffffff',
      align: 'center',
      boundsAlignH: "center", // bounds center align horizontally
      boundsAlignV: "middle" // bounds center align vertically
    };

    if (win) {
      // If the player just completed the last level, do not prompt to continue.
      // Instead, show a victory dialogue and return them to the menu!
      // maxLevel is created at the top of the file. Update this number to be the number of the last level!!!
      if (currentLevel == maxLevel) {
        var returnToMenu = function() {
          music.stop();
          // Have to reset all values incase the player decides to play again!
          // These values are maintained when changing states for some reason!
          blockCount = 0; // Used to keep track of how many blocks have been broken.
          blockTotal = 0; // Used to keep track of how many total blocks there are.
          currentLevel = 1; // Used to maintain which tile map we are on whenever we reset this state.
          maxLevel = 2; // Used to keep track of whether or not this is the last level.
          levelComplete = false;
          jumpTimer = 0; // Used to make sure jumping can only occur when on ground.
          slide = 'none';
          score = 0;
          time = 0;
          game.state.restart();
          // Oddly enough, without this conditional, the reset will get skipped and playing again will restart
          // level2 with the same score you had last time. The conditional ensures the reset happens before the
          // state change.
          let reset = true;
          if (reset) game.state.start('MainMenu');

        }
        let victory = game.add.sprite(0, 0, 'victory');
        victory.fixedToCamera = true;
        let winTimer = game.time.create();
        let goBack = winTimer.add(Phaser.Timer.SECOND * 5, returnToMenu, this);
        winTimer.start();
      }
      else {
        // Creates the group for the dialogue.
        let winGroup = game.add.group();
        winGroup.fixedToCamera = true;
        // Populate the dialogue with all the elements.
        let win = game.add.sprite(0, 0, 'levelComplete');
        winGroup.add(win);
        if (rating == 1) {
          let star1 = game.add.sprite(game.world.centerX - 64, 200, 'star');
          winGroup.add(star1);
          let star2 = game.add.sprite(game.world.centerX - 16, 200, 'noStar');
          winGroup.add(star2);
          let star3 = game.add.sprite(game.world.centerX + 32, 200, 'noStar');
          winGroup.add(star3);
        }
        else if (rating == 2) {
          let star1 = game.add.sprite(game.world.centerX - 64, 200, 'star');
          winGroup.add(star1);
          let star2 = game.add.sprite(game.world.centerX - 16, 200, 'star');
          winGroup.add(star2);
          let star3 = game.add.sprite(game.world.centerX + 32, 200, 'noStar');
          winGroup.add(star3);
        }
        if (rating == 3) {
          let star1 = game.add.sprite(game.world.centerX - 64, 200, 'star');
          winGroup.add(star1);
          let star2 = game.add.sprite(game.world.centerX - 16, 200, 'star');
          winGroup.add(star2);
          let star3 = game.add.sprite(game.world.centerX + 32, 200, 'star');
          winGroup.add(star3);
        }
        // Convoluted method of centering text.
        let scoreCounter = game.add.text(90, 300, score, textStyle);
        scoreCounter.x = game.world.centerX - (scoreCounter.width / 2);
        winGroup.add(scoreCounter);
        // The button for restarting. ADD A QUIT BUTTON? <------------------------------------------------------
        let continueButtonFrame = game.add.sprite(game.world.centerX - 132, 435, 'buttonFrame');
        winGroup.add(continueButtonFrame);
        let continueButton = game.add.button(game.world.centerX - 128, 438, 'buttons', nextLevel, null, 5, 1, 3);
        winGroup.add(continueButton);
      }
    }
    else {
      // Creates the group for the dialogue.
      let failGroup = game.add.group();
      failGroup.fixedToCamera = true;
      // Populate the dialogue with all the elements.
      let failed = game.add.sprite(0, 0, 'levelFailed');
      failGroup.add(failed);
      let star1 = game.add.sprite(game.world.centerX - 64, 200, 'noStar');
      failGroup.add(star1);
      let star2 = game.add.sprite(game.world.centerX - 16, 200, 'noStar');
      failGroup.add(star2);
      let star3 = game.add.sprite(game.world.centerX + 32, 200, 'noStar');
      failGroup.add(star3);
      // Convoluted method of centering text.
      let scoreCounter = game.add.text(90, 300, score, textStyle);
      scoreCounter.x = game.world.centerX - (scoreCounter.width / 2);
      failGroup.add(scoreCounter);
      // The button for restarting. ADD A QUIT BUTTON? <------------------------------------------------------
      let retryButtonFrame = game.add.sprite(game.world.centerX - 132, 435, 'buttonFrame');
      failGroup.add(retryButtonFrame);
      let retryButton = game.add.button(game.world.centerX - 128, 438, 'buttons', restartLevel, null, 10, 6, 8);
      failGroup.add(retryButton);
    }
  }

  function restartLevel() {
    music.stop();
    // Reset all global variables.
    blockCount = 0;
    blockTotal = 0;
    levelComplete = false;
    score = 0;
    time = 0;
    game.time.reset();
    game.state.restart();
  }

  function nextLevel() {
    music.stop();
    // Reset all global variables.
    blockCount = 0;
    blockTotal = 0;
    levelComplete = false;
    score = 0;
    time = 0;
    // Sets us up to load the next level!
    currentLevel++;
    // Resets the game clock.
    game.time.reset();
    // Start the next level.
    game.state.restart();
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
      this.blockStep = game.add.audio('blockStep');
      this.blockStep.volume = .3;
      this.playerWater = game.add.audio('playerWater');
      this.playerWater.volume = .3;
      // Background image
      let background = game.add.sprite(0, 0, 'background');

      // Add the tilemap to the game.
      this.map = game.add.tilemap('level' + parseInt(currentLevel));
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
        blockTotal++;
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

      // Sets up the HUD.
      this.HUD = game.add.group();
      this.HUD.fixedToCamera = true;
      // Score
      this.scoreCounter = game.add.text(0, 0, 'Score = ' + score, {fill:'black', fontSize:'20px'});
      this.HUD.add(this.scoreCounter);
      // Blocks
      this.blockCounterImage = game.add.sprite(0, 32, 'iceBlock', 3);
      this.HUD.add(this.blockCounterImage);
      this.blockCounter = game.add.text(35, 37, '= ' + blockCount, {fill:'black', fontSize:'20px'});
      this.HUD.add(this.blockCounter);
      // Timer
      this.timerImage = game.add.sprite(0, 70, 'hourglass', 0);
      this.HUD.add(this.timerImage);
      this.timeCounter = game.add.text(35, 75, '= ' + time, {fill:'black', fontSize:'20px'});
      this.HUD.add(this.timeCounter);

      game.time.reset(); // Resets the game clock since it was ticking during this create phase!
    },

    update: function () {
      // Maintains the running timer for survival, timer starts a couple seconds before player gets control,
      // so we remove two seconds to start out to adjust.
      if (!levelComplete) {
        time = (Math.floor(game.time.totalElapsedSeconds()));
        this.timeCounter.text = '= ' + time;
      }

      // If the player makes contact with the water layer then the level ends.
      game.physics.arcade.collide(this.player, this.waterLayer, endLevel, null, this);

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
