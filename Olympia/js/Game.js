"use strict";

GameStates.makeGame = function(game, shared) {
  // All the globals needed for all the different helper functions.
  var jumpTimer = 0; // Used to make sure jumping can only occur when on ground.
  var attackTimer = 0 // Used to make sure attacks cannot be spammed.
  var inPool = false;
  var music = null;
  var water = 100;
  var score = 0;
  var playerLives = 3;
  var gemCount = 0;

  function quitGame() {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    music.stop();
    jumpTimer = 0; // Used to make sure jumping can only occur when on ground.
    attackTimer = 0 // Used to make sure attacks cannot be spammed.
    inPool = false;
    water = 100;
    score = 0;
    playerLives = 3;
    gemCount = 0;
    game.state.start('MainMenu');
  }

  // If player loses all health or touches a killing tile, player is killed.
  function playerDeath(player, cause) {
    this.player.kill();
    this.player.x = this.characterX;
    this.player.y = this.characterY;
    playerLives--;
    this.death.play();
    this.livesCounter.text = '= ' + playerLives;
    if (playerLives == 0) {
      // game over!
      let gameOver = game.add.text(225, 250, 'GAME OVER!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
      gameOver.fixedToCamera = true;
      game.time.events.add(5000, quitGame, this);
    }
    else this.player.revive();
  }

  // Called when player and item collide.
  // Item is killed, sound is played, and the effect on the game is different per item.
  function collectItem(player, item) {
    if (item.name == 'gem') {
      item.kill();
      this.gemGrab.play();
      score += 10;
      this.scoreCounter.text = 'Score = ' + score;
      gemCount++;
      this.gemCounter.text = '= ' + gemCount;
      if (gemCount == 40) {
        playerLives++;
        this.livesCounter.text = '= ' + playerLives;
      }
    }
    else if (item.name == 'trident') {
      item.kill();
      this.gemGrab.play();
      score += 50;
      this.scoreCounter.text = 'Score = ' + score;
    }
    else if (item.name == 'bucket') {
      item.kill();
      this.gemGrab.play();
      score += 10;
      this.scoreCounter.text = 'Score = ' + score;
      water += 10;
      this.waterBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (water/100), this.waterBar.height));
    }
    else if (item.name == 'life') {
      item.kill();
      this.gemGrab.play();
      playerLives++;
      this.livesCounter.text = '= ' + playerLives;
      score += 50;
      this.scoreCounter.text = 'Score = ' + score;
    }
  }

  return {
    create: function () {
      // Sets up all the requirements of the game world.
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.setBoundsToWorld();
      game.world.setBounds(0, 0, 3200, 4800);
      let background = game.add.sprite(0, 0, 'background');

      // Sets up all of the sounds and music.
      music = game.add.audio('mainMusic');
			music.loop = true;
			music.volume = .3;
		 	music.play();
      this.gemGrab = game.add.audio('gemGrab');
			this.gemGrab.volume = .3;
      this.damage = game.add.audio('damage');
      this.damage.volume = .3;
      this.death = game.add.audio('death');
      this.death.volume = .3;
      this.jump = game.add.audio('jump');
      this.jump.volume = .3;
      this.splish = game.add.audio('splish');
      this.splish.volume = .3;

      // Add the tilemap to the game.
      this.map = game.add.tilemap('level');
      this.map.addTilesetImage('tiles', 'tiles');
      // Sets up the different layers of the map for interaction.
      this.deathLayer = this.map.createLayer('DeathLayer'); // invisible layer for falling in pits.
      this.deathLayer.visible = false;
      this.groundLayer = this.map.createLayer('GroundLayer');
      let backgroundLayer = this.map.createLayer('BackgroundLayer');
      let accentLayer = this.map.createLayer('AccentLayer');

      // Sets up the pools
      // pool 1
      this.pool1 = game.add.physicsGroup();
      this.map.createFromObjects('PoolLayer', 'pool1', 'tiles2', 10, true, false, this.pool1);
      this.pool1.forEach(block => {
        block.name = 'pool1';
        block.body.immovable = true;
        block.body.allowGravity = false;
        block.animations.add('water', [10, 11], 3, true);
        block.animations.play('water');
      });
      this.map.createFromObjects('PoolLayer', 'pool1bot', 'tiles2', 15, true, false, this.pool1);
      this.pool1.forEach(block => {
        block.name = 'pool1';
        block.body.immovable = true;
        block.body.allowGravity = false;
      });
     this.spawn1 = game.add.physicsGroup();
      this.characterX = 0;
      this.characterY = 0;
      this.map.createFromObjects('PoolSpawn', 'spawn1', 'tiles2', 12, true, false, this.spawn1);
      this.spawn1.forEach(spawn => {
        spawn.name = 'spawn1';
        spawn.visible = false;
        this.characterX = spawn.x;
        this.characterY = spawn.y;
      });
      // pool 2
      this.pool2 = game.add.physicsGroup();
      this.map.createFromObjects('PoolLayer', 'pool2', 'tiles2', 10, true, false, this.pool2);
      this.pool2.forEach(block => {
        block.name = 'pool2';
        block.body.immovable = true;
        block.body.allowGravity = false;
        block.animations.add('water', [10, 11], 3, true);
        block.animations.play('water');
      });
      this.map.createFromObjects('PoolLayer', 'pool2bot', 'tiles2', 15, true, false, this.pool2);
      this.pool2.forEach(block => {
        block.name = 'pool2';
        block.body.immovable = true;
        block.body.allowGravity = false;
      });
      this.spawn2 = game.add.physicsGroup();
      this.map.createFromObjects('PoolSpawn', 'spawn2', 'tiles2', 12, true, false, this.spawn2);
      this.spawn2.forEach(spawn => {
        spawn.name = 'spawn2';
        spawn.visible = false;
      });
      // pool 3
      this.pool3 = game.add.physicsGroup();
      this.map.createFromObjects('PoolLayer', 'pool3', 'tiles2', 10, true, false, this.pool3);
      this.pool3.forEach(block => {
        block.name = 'pool3';
        block.body.immovable = true;
        block.body.allowGravity = false;
        block.animations.add('water', [10, 11], 3, true);
        block.animations.play('water');
      });
      this.map.createFromObjects('PoolLayer', 'pool3bot', 'tiles2', 15, true, false, this.pool3);
      this.pool3.forEach(block => {
        block.name = 'pool3';
        block.body.immovable = true;
        block.body.allowGravity = false;
      });
      this.spawn3 = game.add.physicsGroup();
      this.map.createFromObjects('PoolSpawn', 'spawn3', 'tiles2', 12, true, false, this.spawn3);
      this.spawn3.forEach(spawn => {
        spawn.name = 'spawn3';
        spawn.visible = false;
      });

      // Sets up the enemies.
      this.batHomes = game.add.physicsGroup();
      this.bats = game.add.physicsGroup();
      this.map.createFromObjects('EnemyLayer', 'batHome', 'tiles2', 10, true, false, this.batHomes);
      this.batHomes.forEach(home => {
        home.visible = false;
        let bat = game.add.sprite(home.x, home.y, 'bat');
        game.physics.arcade.enable(bat);
        bat.animations.add('flyLeft', [1,0,1,2], 8, true);
        bat.animations.add('flyRight', [4,3,4,5], 8, true);
        bat.animations.play('flyLeft');
        bat.facing = 'left';
        bat.home = home;
        this.bats.add(bat);
      });

      // Sets up the items.
      this.gems = game.add.physicsGroup();
      this.map.createFromObjects('ItemLayer', 'gem', 'items', 2, true, false, this.gems);
      this.gems.forEach(gem => {
        gem.body.immovable = true;
        gem.animations.add('gem', [2,3,4,3], 5, true);
        gem.animations.play('gem');
      });
      this.tridents = game.add.physicsGroup();
      this.map.createFromObjects('ItemLayer', 'trident', 'items', 1, true, false, this.tridents);
      this.tridents.forEach(trident => {
        trident.body.immovable = true;
      });
      this.buckets = game.add.physicsGroup();
      this.map.createFromObjects('ItemLayer', 'bucket', 'items', 5, true, false, this.buckets);
      this.buckets.forEach(bucket => {
        bucket.body.immovable = true;
      });
      this.lifes = game.add.physicsGroup();
      this.map.createFromObjects('ItemLayer', 'life', 'items', 0, true, false, this.lifes);
      this.lifes.forEach(life => {
        life.body.immovable = true;
      });

      // Sets up collision detection for the different map layers.
      this.map.setCollisionBetween(1, 100, true, this.groundLayer);
      this.map.setCollisionBetween(1, 100, true, this.deathLayer);
      this.groundLayer.resizeWorld();

      // Sets up the player and everything they need.
      this.player = game.add.sprite(this.characterX, this.characterY, 'player');
      // Sets up player physics.
      game.physics.arcade.enable(this.player);
      this.player.body.gravity.y = 600;
      this.player.body.collideWorldBounds = true;
      // maintains the direciton the player is facing.
      this.player.facing = 'right';
      //this.player.scale.setTo(1,1);
      this.player.health = 4;
      // Sets up the player animations.
      this.player.animations.add('idleRight', [10,11], 3, true);
      this.player.animations.add('idleLeft', [18,17], 3, true);
      this.player.animations.add('right', [0,1,2,3,4], 8, true);
      this.player.animations.add('left', [9,8,7,6,5], 8, true);
      this.player.animations.add('jumpLeft', [18,17,16,15], 15, false);
      this.player.animations.add('jumpRight', [10,11,12,13], 15, false);
      this.player.animations.add('fallRight', [13], 1, true);
      this.player.animations.add('fallLeft', [15], 1, true);
      this.player.animations.add('waterRight', [14], 1, true);
      this.player.animations.add('waterLeft', [19], 1, true);
      this.player.animations.play('idleRight');
      // The player's attack
      this.waterbolt = game.add.sprite(this.player.x + this.player.width / 2, this.player.y + this.player.height/2, 'waterblast');
      game.physics.arcade.enable(this.waterbolt);
      this.waterbolt.kill();
      this.waterbolt.animations.add('boltRight', [0,1,2], 5, true);
      this.waterbolt.animations.add('boltLeft', [5,4,3], 5, true);


      // Sets up the HUD.
      this.HUD = game.add.group();
      this.HUD.fixedToCamera = true;
      this.waterFrame = game.add.sprite(5, 10, 'water_frame');
      this.HUD.add(this.waterFrame);
      this.waterBar = game.add.sprite(8, 13, 'water_bar');
      this.HUD.add(this.waterBar);
      // Score
      this.scoreCounter = game.add.text(5, 30, 'Score = ' + score, {fill:'white', fontSize:'20px'});
      this.HUD.add(this.scoreCounter);
      this.HUD.fixedToCamera = true;
      // Gems
      this.gemCounterImage = game.add.sprite(5, 62, 'items', 2);
      this.HUD.add(this.gemCounterImage);
      this.gemCounter = game.add.text(37, 58, '= ' + gemCount, {fill:'white', fontSize:'20px'});
      this.HUD.add(this.gemCounter);

      // Lives
      this.livesImage = game.add.sprite(5, 94, 'items', 0);
      this.HUD.add(this.livesImage);
      this.livesCounter = game.add.text(37, 88, '= ' + playerLives, {fill:'white', fontSize:'20px'});
      this.HUD.add(this.livesCounter);

      this.originalWidth = this.waterBar.width;

      // ALl of the code to set up the controls for the plaer.
      this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
      this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
      this.actionKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

      game.camera.follow(this.player); // Enables camera to follow player.
    },

    update: function () {
      // Enables the collision between the player, layers, and items.
      // Also sets up the callback function for collision.
      game.physics.arcade.collide(this.player, this.groundLayer);
      game.physics.arcade.collide(this.bat, this.groundLayer);
      game.physics.arcade.overlap(this.player, this.gems, collectItem, null, this);
      game.physics.arcade.overlap(this.player, this.tridents, collectItem, null, this);
      game.physics.arcade.overlap(this.player, this.buckets, collectItem, null, this);
      game.physics.arcade.overlap(this.player, this.lifes, collectItem, null, this);

      this.bats.forEach(bat => {
        // Collision with world.
        game.physics.arcade.collide(bat, this.groundLayer);
        game.physics.arcade.collide(bat, this.pool1);
        game.physics.arcade.collide(bat, this.pool2);
        game.physics.arcade.collide(bat, this.pool3);
        // Collision with waterbolt.
        game.physics.arcade.overlap(this.waterbolt, bat, () => {
          bat.kill();
        });
        // Collision with player.
        game.physics.arcade.overlap(this.player, bat, () => {
          if (this.player.body.touching.down && bat.body.touching.up) {
            this.player.body.velocity.y = -250;
            bat.kill();
            score += 25;
            this.scoreCounter.text = 'Score = ' + score;
          }
          else {
            this.player.health -= 1;
            this.damage.play();
            if (bat.facing == 'right') this.player.body.velocity.x = 200;
            else this.player.body.velocity.x = -200;
          }
        }, null, this);
        // The bat chase mechanism.
        if (Math.abs(bat.home.x - this.player.x) <= 384 && Math.abs(bat.home.y - this.player.y) <= 384) {
          let radians = game.physics.arcade.angleBetween(bat, this.player);
          let degrees = radians * (180/Math.PI);
          game.physics.arcade.velocityFromAngle(degrees, 130, bat.body.velocity);
        }
        else {
          let radians = game.physics.arcade.angleBetween(bat, bat.home);
          let degrees = radians * (180/Math.PI);
          game.physics.arcade.velocityFromAngle(degrees, 130, bat.body.velocity);
          game.physics.arcade.overlap(bat, bat.home, () => {
            bat.body.velocity.x = 0;
            bat.body.velocity.y = 0;
          }, null, this);
        }
        // Updates the animation based on what direction it is flying in.
        if (bat.body.velocity.x > 0) {
          bat.facing = 'right';
          bat.animations.play('flyRight');
        }
        else {
          bat.facing = 'left';
          bat.animations.play('flyLeft');
        }
      });

      game.physics.arcade.collide(this.player, this.deathLayer, playerDeath, null, this);
      inPool = game.physics.arcade.overlap(this.player, this.pool1, () => {
        this.spawn1.forEach(spawn => {
          this.characterX = spawn.x;
          this.characterY = spawn.y;
        });
      }, null, this) || game.physics.arcade.overlap(this.player, this.pool2, () => {
        this.spawn2.forEach(spawn => {
          this.characterX = spawn.x;
          this.characterY = spawn.y;
        });
      }, null, this) || game.physics.arcade.overlap(this.player, this.pool3, () => {
        this.spawn3.forEach(spawn => {
          this.characterX = spawn.x;
          this.characterY = spawn.y;
        });
      }, null, this);
      if (water <= 0 || this.player.health == 0) {
        this.player.kill();
        this.death.play();
        this.player.x = this.characterX;
        this.player.y = this.characterY;
        playerLives--;
        this.livesCounter.text = '= ' + playerLives;
        if (playerLives == 0) {
          // game over!
          let gameOver = game.add.text(225, 250, 'GAME OVER!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
          gameOver.fixedToCamera = true;
          game.time.events.add(5000, quitGame, this);
        }
        else this.player.revive();
      }

      if (inPool && water < 100) {
        water += 1;
        if (water > 100) water = 100;
        this.waterBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (water/100), this.waterBar.height));
      }

      // Key handling, what happens when a key is pressed:
      // If left is pressed, move left, if in air use in-air sprite.
      if (this.actionKey.isDown) {
        if (game.time.now > attackTimer) {
          this.waterbolt.x = this.player.x + this.player.width / 2;
          this.waterbolt.y = this.player.y + this.player.height / 2;
          this.waterbolt.revive();
          this.splish.play();
          if (this.player.facing == 'left') {
            this.waterbolt.animations.play('boltLeft');
            this.waterbolt.body.velocity.x = -300;
          }
          else if (this.player.facing == 'right') {
            this.waterbolt.animations.play('boltRight');
            this.waterbolt.body.velocity.x = 300;
          }
          water -= 5;
          this.waterBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (water/100), this.waterBar.height));
          attackTimer = game.time.now + 1000;
          game.time.events.add(1000, () => {
            this.waterbolt.kill();
          }, this);
        }
      }

      if (this.upKey.isDown) {
        if (inPool) {
          this.player.body.velocity.y = -200;
        }
        else if (this.player.body.onFloor() && game.time.now > jumpTimer) {
          if (this.player.facing == 'right') this.player.animations.play('jumpRight');
          else this.player.animations.play('jumpLeft');
          this.player.body.velocity.y = -500;
          this.jump.play();
          water -= 1;
          this.waterBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (water/100), this.waterBar.height));
          jumpTimer = game.time.now + 750;
        }
      }
      // If right is pressed, move right, if in air use in-air sprite.
      else if (this.rightKey.isDown) {
        this.player.facing = 'right';
        this.player.body.velocity.x = 120;
        if (this.player.body.onFloor() && !inPool) {
          this.player.animations.play('right');
          water -= .05;
          this.waterBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (water/100), this.waterBar.height));
        }
        else if (inPool) this.player.animations.play('waterRight');
        else this.player.animations.play('fallRight');
      }
      else if (this.leftKey.isDown) {
        this.player.facing = 'left';
        this.player.body.velocity.x = -120;
        if (this.player.body.onFloor() && !inPool) {
          this.player.animations.play('left');
          water -= .05;
          this.waterBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (water/100), this.waterBar.height));
        }
        else if (inPool) this.player.animations.play('waterLeft');
        else this.player.animations.play('fallLeft');
      }
      // Otherwise the player is idle.
      else {
        if (this.player.body.onFloor()) {
          if (this.player.facing == 'right') {
            if (inPool) this.player.animations.play('waterRight');
            else this.player.animations.play('idleRight');
          }
          else {
            if (inPool) this.player.animations.play('waterLeft');
            else this.player.animations.play('idleLeft');
          }
        }
        if (this.player.body.velocity.x != 0) {
          if (this.player.body.velocity.x > 0) this.player.body.velocity.x = this.player.body.velocity.x - 5;
          else this.player.body.velocity.x = this.player.body.velocity.x + 5;
        }
      }
    }
  };
};
