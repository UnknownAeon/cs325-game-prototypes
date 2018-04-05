"use strict";

GameStates.makeGame = function( game, shared ) {
    // All the different variables at use throughout the program.
    let playerDirection = 'down';
    var confirmed  = false;
    var ethereal = false;
    var hasKey = false;
    var magicka = 100;
    var remainingKeys = 0;

    function quitGame() {
      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
      ethereal = false;
      hasKey = false;
      magicka = 100;
      remainingKeys = 0;
      //  Then let's go back to the main menu.
      game.state.start('MainMenu');
    }

    // Restarts the game state whenever a game over or a win occurs.
    function restart() {
      this.music.stop();
      game.state.restart();
      quitGame();
    }

    function turnEthereal() {
      if (ethereal) {
        ethereal = false;
        this.player.animations.play('criminalDown');
        this.invisible.play();
      }
      else if (!ethereal && magicka > 0) {
        ethereal = true;
        this.player.animations.play('ghostDown');
        this.invisible.play();
      }
    }

    return {
      create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 800, 800);

        // Sets up the music to play.
        this.music = game.add.audio('music');
        this.music.loop = true;
  			this.music.volume = .3;
  		  this.music.play();
        //music.fadeOut(3000);

        // Sets up all of the sounds effects that are in use in the game.
        this.keySound = game.add.audio('key');
        this.keySound.volume = .3;
        this.keyHole = game.add.audio('keyhole');
        this.keyHole.volume = .3;
        this.invisible = game.add.audio('invisibility');
        this.invisible.volume = .3;
        this.playerStep = game.add.audio('playerstep');
        this.playerStep.volume = .3;
        this.alert = game.add.audio('alert');
        this.alert.volume = .3;

        // Sets up the tilemap for the world and its layers.
        this.map = game.add.tilemap('level2');
        this.map.addTilesetImage('tiles', 'tiles');
        let groundLayer = this.map.createLayer('GroundLayer');
        this.wallLayer = this.map.createLayer('WallLayer');
        this.map.setCollisionBetween(1, 1000, true, this.wallLayer);
        this.wallLayer.resizeWorld();

        this.exitDoor = game.add.physicsGroup();
        this.map.createFromObjects('ExitDoorLayer', 'exitDoor', 'exitDoor', [0], true, false, this.exitDoor);
        this.exitDoor.forEach(block => {
          game.physics.enable(block, Phaser.Physics.ARCADE);
          block.body.immovable = true;
          block.body.allowGravity = false;
        });

        this.keys = game.add.physicsGroup();
        this.map.createFromObjects('KeyLayer', 'key', 'key', 0, true, false, this.keys);
        this.keys.forEach(key => {
          remainingKeys++;
          key.body.immovable = true;
          key.animations.add('float', [0,1,2,3], 4, true);
          key.animations.play('float');
        });

        this.rightGuards = game.add.physicsGroup();
        this.leftGuards = game.add.physicsGroup();
        this.upGuards = game.add.physicsGroup();
        this.downGuards = game.add.physicsGroup();
        // Create guards that start right.
        this.tempGuards = game.add.physicsGroup();
        this.map.createFromObjects('RightGuards', 'rightGuard', 'guardLeftRight', 'guardRight1', true, false, this.tempGuards)
        this.tempGuards.forEach(enemy => {
          // Placing it at the location of the object spawn tile.
          let newGuard = game.add.sprite(enemy.x, enemy.y, 'guardLeftRight');
          game.physics.arcade.enable(newGuard);
          newGuard.animations.add('walkLeft', ['guardLeft1', 'guardLeft2', 'guardLeft3'], 4, true);
          newGuard.animations.add('walkRight', ['guardRight1', 'guardRight2', 'guardRight3'], 4, true);
          newGuard.animations.play('walkRight');
          newGuard.body.collideWorldBounds = true;
          newGuard.body.gravity.y = 0;
          newGuard.body.gravity.x = 0;
          newGuard.body.velocity.x = 125;
          newGuard.direction = 'right'; // Extra variable added to keep track of bear heading.
          this.rightGuards.add(newGuard);
          enemy.kill(); // remove the stretched out bear that was temporarily placed.
        });
        this.tempGuards.destroy();

        // Create guards that start left.
        this.tempGuards = game.add.physicsGroup();
        this.map.createFromObjects('LeftGuards', 'leftGuard', 'guardLeftRight', 'guardLeft1', true, false, this.tempGuards)
        this.tempGuards.forEach(enemy => {
          // Placing it at the location of the object spawn tile.
          let newGuard = game.add.sprite(enemy.x, enemy.y, 'guardLeftRight');
          game.physics.arcade.enable(newGuard);
          newGuard.animations.add('walkLeft', ['guardLeft1', 'guardLeft2', 'guardLeft3'], 4, true);
          newGuard.animations.add('walkRight', ['guardRight1', 'guardRight2', 'guardRight3'], 4, true);
          newGuard.animations.play('walkLeft');
          newGuard.body.collideWorldBounds = true;
          newGuard.body.gravity.y = 0;
          newGuard.body.gravity.x = 0;
          newGuard.body.velocity.x = -125;
          newGuard.direction = 'left'; // Extra variable added to keep track of bear heading.
          this.leftGuards.add(newGuard);
          enemy.kill(); // remove the stretched out bear that was temporarily placed.
        });
        this.tempGuards.destroy();

        // Create guards that start up.
        this.tempGuards = game.add.physicsGroup();
        this.map.createFromObjects('UpGuards', 'upGuard', 'guardUpDown', 'guardUp1', true, false, this.tempGuards)
        this.tempGuards.forEach(enemy => {
          // Placing it at the location of the object spawn tile.
          let newGuard = game.add.sprite(enemy.x, enemy.y, 'guardUpDown');
          game.physics.arcade.enable(newGuard);
          newGuard.animations.add('walkUp', ['guardUp1', 'guardUp2', 'guardUp3'], 4, true);
          newGuard.animations.add('walkDown', ['guardDown1', 'guardDown2', 'guardDown3'], 4, true);
          newGuard.animations.play('walkUp');
          newGuard.body.collideWorldBounds = true;
          newGuard.body.gravity.y = 0;
          newGuard.body.gravity.x = 0;
          newGuard.body.velocity.y = -125;
          newGuard.direction = 'up'; // Extra variable added to keep track of bear heading.
          this.upGuards.add(newGuard);
          enemy.kill(); // remove the stretched out bear that was temporarily placed.
        });
        this.tempGuards.destroy();

        // Create guards that start down.
        this.tempGuards = game.add.physicsGroup();
        this.map.createFromObjects('DownGuards', 'downGuard', 'guardUpDown', 'guardDown1', true, false, this.tempGuards)
        this.tempGuards.forEach(enemy => {
          // Placing it at the location of the object spawn tile.
          let newGuard = game.add.sprite(enemy.x, enemy.y, 'guardUpDown');
          game.physics.arcade.enable(newGuard);
          newGuard.animations.add('walkUp', ['guardUp1', 'guardUp2', 'guardUp3'], 4, true);
          newGuard.animations.add('walkDown', ['guardDown1', 'guardDown2', 'guardDown3'], 4, true);
          newGuard.animations.play('walkDown');
          newGuard.body.collideWorldBounds = true;
          newGuard.body.gravity.y = 0;
          newGuard.body.gravity.x = 0;
          newGuard.body.velocity.y = 125;
          newGuard.direction = 'down'; // Extra variable added to keep track of bear heading.
          this.downGuards.add(newGuard);
          enemy.kill(); // remove the stretched out bear that was temporarily placed.
        });
        this.tempGuards.destroy();

        // All of the code to create the player, their physics, and their animations.
        this.player = game.add.sprite(74, 515, 'player');
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 0;
        this.player.body.gravity.x = 0;
        this.player.body.velocity.x = 0;
        this.player.animations.add('ghostUp', Phaser.Animation.generateFrameNames('ghostUp', 1, 3), 4, true);
        this.player.animations.add('ghostLeft', Phaser.Animation.generateFrameNames('ghostLeft', 1, 3), 4, true);
        this.player.animations.add('ghostRight', Phaser.Animation.generateFrameNames('ghostRight', 1, 3), 4, true);
        this.player.animations.add('ghostDown', Phaser.Animation.generateFrameNames('ghostDown', 1, 3), 4, true);
        this.player.animations.add('walkUp', Phaser.Animation.generateFrameNames('criminalUp', 1, 3), 4, true);
        this.player.animations.add('walkLeft', Phaser.Animation.generateFrameNames('criminalLeft', 1, 3), 4, true);
        this.player.animations.add('walkRight', Phaser.Animation.generateFrameNames('criminalRight', 1, 3), 4, true);
        this.player.animations.add('walkDown', Phaser.Animation.generateFrameNames('criminalDown', 1, 3), 4, true);

        this.doors = game.add.physicsGroup();
        this.map.createFromObjects('DoorLayer', 'door', 'door', [0], true, false, this.doors);


        // Sets up the HUD.
        this.HUD = game.add.group();
        this.HUD.fixedToCamera = true;

        this.magickaFrame = game.add.sprite(5, 10, 'magicka_frame');
        this.HUD.add(this.magickaFrame);
        this.magickaBar = game.add.sprite(8, 13, 'magicka_bar');
        this.HUD.add(this.magickaBar);
        this.originalWidth = this.magickaBar.width;

        // ALl of the code to set up the controls for the plaer.
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.actionKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.actionKey.onDown.add(turnEthereal,this);

        game.camera.follow(this.player); // Enables camera to follow player.
      },

      update: function () {
        // All of the collision detection.
        game.physics.arcade.collide(this.player, this.wallLayer);

        // Player collision with keys.
        game.physics.arcade.overlap(this.player, this.keys, (player, item) => {
          if (item.name == 'key' && !hasKey) {
            item.kill();
            this.keySound.play();
            hasKey = true;
          }
        }, null, this);

        // Collision for the exit door.
        this.exitDoor.forEach(block => {
          // Player Collision
          game.physics.arcade.collide(this.player, block, () => {
            if (hasKey) {
              hasKey = false;
              remainingKeys -= 1;
              this.keyHole.play();
            }
            if (remainingKeys == 0) {
              this.player.kill();
              let win = game.add.text(300, 250, 'YOU WIN!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
              win.fixedToCamera = true;
              game.time.events.add(5000, restart, this);
            }
          }, null, this);
          // Guard Collision
          this.upGuards.forEach(guard => {
            game.physics.arcade.collide(guard, block, () => {
              if (guard.direction == 'down') {
                guard.direction = 'up';
                guard.animations.play('walkUp');
                guard.body.velocity.y = -125;
              }
              else if (guard.direction == 'up') {
                guard.direction = 'down';
                guard.animations.play('walkDown');
                guard.body.velocity.y = 125;
              }
            }, null, this);
          });
        });

        // Collision detection for the guards
        this.leftGuards.forEach(guard => {
          game.physics.arcade.collide(guard, this.wallLayer, () => {
            if (guard.direction == 'left') {
              guard.direction = 'right';
              guard.animations.play('walkRight');
              guard.body.velocity.x = 125;
            }
            else if (guard.direction == 'right') {
              guard.direction = 'left';
              guard.animations.play('walkLeft');
              guard.body.velocity.x = -125;
            }
          }, null, this);

          game.physics.arcade.overlap(guard, this.player, () => {
            if (!ethereal) {
              this.player.kill();
              this.alert.play();
              guard.body.velocity.x = 0;
              guard.body.velocity.y = 0;
              let gameOver = game.add.text(225, 250, 'GAME OVER!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
              gameOver.fixedToCamera = true;
              game.time.events.add(5000, restart, this);
            }
          }, null, this);
        });
        this.rightGuards.forEach(guard => {
          game.physics.arcade.collide(guard, this.wallLayer, () => {
            if (guard.direction == 'left') {
              guard.direction = 'right';
              guard.animations.play('walkRight');
              guard.body.velocity.x = 125;
            }
            else if (guard.direction == 'right') {
              guard.direction = 'left';
              guard.animations.play('walkLeft');
              guard.body.velocity.x = -125;
            }
          }, null, this);

          game.physics.arcade.overlap(guard, this.player, () => {
            if (!ethereal) {
              this.player.kill();
              this.alert.play();
              guard.body.velocity.x = 0;
              guard.body.velocity.y = 0;
              let gameOver = game.add.text(225, 250, 'GAME OVER!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
              gameOver.fixedToCamera = true;
              game.time.events.add(5000, restart, this);
            }
          }, null, this);
        });
        this.upGuards.forEach(guard => {
          game.physics.arcade.collide(guard, this.wallLayer, () => {
            if (guard.direction == 'down') {
              guard.direction = 'up';
              guard.animations.play('walkUp');
              guard.body.velocity.y = -125;
            }
            else if (guard.direction == 'up') {
              guard.direction = 'down';
              guard.animations.play('walkDown');
              guard.body.velocity.y = 125;
            }
          }, null, this);

          game.physics.arcade.overlap(guard, this.player, () => {
            if (!ethereal) {
              this.player.kill();
              this.alert.play();
              guard.body.velocity.x = 0;
              guard.body.velocity.y = 0;
              let gameOver = game.add.text(225, 250, 'GAME OVER!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
              gameOver.fixedToCamera = true;
              game.time.events.add(5000, restart, this);
            }
          }, null, this);
        });
        this.downGuards.forEach(guard => {
          game.physics.arcade.collide(guard, this.wallLayer, () => {
            if (guard.direction == 'down') {
              guard.direction = 'up';
              guard.animations.play('walkUp');
              guard.body.velocity.y = -125;
            }
            else if (guard.direction == 'up') {
              guard.direction = 'down';
              guard.animations.play('walkDown');
              guard.body.velocity.y = 125;
            }
          }, null, this);

          game.physics.arcade.overlap(guard, this.player, () => {
            if (!ethereal) {
              this.player.kill();
              this.alert.play();
              guard.body.velocity.x = 0;
              guard.body.velocity.y = 0;
              let gameOver = game.add.text(225, 250, 'GAME OVER!', {fill:'white', fontSize:'50px', boundsAlignH:'center', boundsAlignV:'middle'});
              gameOver.fixedToCamera = true;
              game.time.events.add(5000, restart, this);
            }
          }, null, this);
        });

        if (ethereal) {
          magicka -= .1;
          this.magickaBar.crop(new Phaser.Rectangle(0, 0, this.originalWidth * (magicka/100), this.magickaBar.height));
        }
        if (magicka < 0 && !confirmed) {
          ethereal = false;
          confirmed = true;
          this.player.animations.play('criminalDown');
          this.invisible.play();
        }

        // Key handling, what happens when a key is pressed:
        if (this.downKey.isDown) {
          if (ethereal) this.player.animations.play('ghostDown');
          else this.player.animations.play('walkDown');
          this.player.body.velocity.y = 125;
          this.player.body.velocity.x = 0;
        }
        // If left is pressed, move left, if in air use in-air sprite.
        else if (this.leftKey.isDown) {
          if (ethereal) this.player.animations.play('ghostLeft');
          else this.player.animations.play('walkLeft');
          this.player.body.velocity.x = -125;
          this.player.body.velocity.y = 0;
        }
        // If right is pressed, move right, if in air use in-air sprite.
        else if (this.rightKey.isDown) {
          if (ethereal) this.player.animations.play('ghostRight');
          else this.player.animations.play('walkRight');
          this.player.body.velocity.x = 125;
          this.player.body.velocity.y = 0;

        }
        else if (this.upKey.isDown) {
          if (ethereal) this.player.animations.play('ghostUp');
          else this.player.animations.play('walkUp');
          this.player.body.velocity.y = -125;
          this.player.body.velocity.x = 0;

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
