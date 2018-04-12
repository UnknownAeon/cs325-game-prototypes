"use strict";

GameStates.makeMainMenu = function( game, shared ) {
	var instructions = null;
	var music = null;
	var menuSelect = null;
	var buttonSelect = null;

	var nextFrame = null;
	var nextButton = null;
	var closeButton = null;
	var closeFrame = null;
	var page = 1;

  function startGame(pointer) {
		buttonSelect.play();
    //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    music.stop();
    //	And start the actual game
    game.state.start('Game');
  }

	function showInstructions() {
		buttonSelect.play();
		if (instructions != null) {
			instructions.kill();
			instructions = null;
		}
		if (page == 1) {
			instructions = game.add.sprite(0, 0, 'instructions1');
			page++;
			nextFrame = game.add.sprite(400 - 132, 445, 'buttonFrame');
      nextButton = game.add.button(400 - 128, 448, 'continueButton', showInstructions, null, 0, 1, 2);
		}
		else if (page == 2) {
			page++;
			instructions = game.add.sprite(0, 0, 'instructions2');
			nextFrame.kill();
			nextFrame = null;
			nextButton.kill();
			nextButton = null;
			nextFrame = game.add.sprite(400 - 132, 445, 'buttonFrame');
      nextButton = game.add.button(400 - 128, 448, 'continueButton', showInstructions, null, 0, 1, 2);
		}
		else if (page == 3){
			page++;
			instructions = game.add.sprite(0, 0, 'instructions3');
			nextFrame.kill();
			nextFrame = null;
			nextButton.kill();
			nextButton = null;
			closeFrame = game.add.sprite(400 - 132, 445, 'buttonFrame');
      closeButton = game.add.button(400 - 128, 448, 'closeButton', showInstructions, null, 0, 1, 2);
		}
		else {
			page = 1;
			closeFrame.kill();
			closeFrame = null;
			closeButton.kill();
			closeButton = null;
		}
	}

  return {
	  create: function () {
	    //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
			music = game.add.audio('titleMusic');
			music.loop = true;
			music.volume = .3;
		  music.play();

			buttonSelect = game.add.audio('button');
			buttonSelect.volume = .3;

			let background = game.add.sprite(0, 0, 'titleBackground');
			background.height = 600;
			let title = game.add.sprite(0, 0, 'title');

			// Sets up the buttons in the center of the screen.
			let playButtonFrame = game.add.sprite(400 - 132, 350, 'buttonFrame');
      let playButton = game.add.button(400 - 128, 353, 'startButton', startGame, null, 0, 1, 2);
			let instButtonFrame = game.add.sprite(400 - 132, 410, 'buttonFrame');
      let instButton = game.add.button(400 - 128, 413, 'instructionsButton', showInstructions, null, 0, 1, 2);
	  },

	  update: function () {
      //	Do some nice funky main menu effect here

	  }
  };
};
