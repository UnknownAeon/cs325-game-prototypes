"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
	var playButton = null;

  function startGame(pointer) {
  	//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    music.stop();
    //	And start the actual game
    game.state.start('Game');
    }

  return {
  	create: function () {
    	//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
      music = game.add.audio('titleMusic');
			music.loop = true;
			music.volume = .3;
      music.play();

			let background = game.add.sprite(0, 0, 'titleBackground');
			// Sets up the button in the center of the screen.
			let playButtonFrame = game.add.sprite(game.world.centerX - 132, 350, 'buttonFrame');
      let playButton = game.add.button(game.world.centerX - 128, 353, 'buttons', startGame, null, 0, 2, 4);

			let title = game.add.sprite(0, 0, 'title');

			// Let's add some penguins to the title screen to give it some personality!
			// The animated walking pengiun on the main menu.
			this.p1 = game.add.sprite(210, 420, 'penguins');
			this.p1.animations.add('walkLeft', ['sprite13', 'sprite17', 'sprite13', 'sprite18'], 4, true);
			this.p1.animations.add('walkRight', ['sprite25', 'sprite29', 'sprite25', 'sprite30'], 4, true);
			this.p1.animations.play('walkRight');
			this.p1MoveRight = game.add.tween(this.p1).to({x: '+150'}, 2500, Phaser.Easing.Linear.None, true);
			this.p1MoveLeft = game.add.tween(this.p1).to({x: '-150'}, 2500, Phaser.Easing.Linear.None, false);
			this.p1LastMove = 'right';

			// The animated sliding penguin on the main menu.
			this.p2 = game.add.sprite(760, 30, 'penguins');
			this.p2.animations.add('slideLeft', ['sprite64'], 1, false);
			this.p2.animations.add('slideRight', ['sprite76'], 1, false);
			this.p2.animations.play('slideLeft');
			this.p2MoveRight = game.add.tween(this.p2).to({x: '+525'}, 4000, Phaser.Easing.Linear.None, false);
			this.p2MoveLeft = game.add.tween(this.p2).to({x: '-525'}, 4000, Phaser.Easing.Linear.None, true);
			this.p2LastMove = 'left';

			// All the penguins that don't move.
			let p3 = game.add.sprite(590, 440, 'penguins');
			p3.animations.add('stand', ['sprite27'], 1, false);
			p3.animations.play('stand');

			let p4 = game.add.sprite(625, 440, 'penguins');
			p4.animations.add('stand', ['sprite16'], 1, false);
			p4.animations.play('stand');

			let p5 = game.add.sprite(110, 520, 'penguins');
			p5.animations.add('stand', ['sprite3'], 1, false);
			p5.animations.play('stand');

			let p6 = game.add.sprite(735, 370, 'penguins');
			p6.animations.add('stand', ['sprite26'], 1, false);
			p6.animations.play('stand');
		},

    update: function () {
			// Tween updates for penguin 1
			if (!this.p1MoveRight.isRunning && this.p1LastMove == 'right') {
				this.p1.animations.play('walkLeft');
				this.p1MoveLeft.start();
				this.p1LastMove = 'left';
			}
			else if (!this.p1MoveLeft.isRunning && this.p1LastMove == 'left') {
				this.p1.animations.play('walkRight');
				this.p1MoveRight.start();
				this.p1LastMove = 'right';
			}

			// Tween updates for penguin 2
			if (!this.p2MoveRight.isRunning && this.p2LastMove == 'right') {
				this.p2.animations.play('slideLeft');
				this.p2MoveLeft.start();
				this.p2LastMove = 'left';
			}
			else if (!this.p2MoveLeft.isRunning && this.p2LastMove == 'left') {
				this.p2.animations.play('slideRight');
				this.p2MoveRight.start();
				this.p2LastMove = 'right';
			}
		}
  };
};
