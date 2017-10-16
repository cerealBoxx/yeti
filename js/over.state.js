var overState = {
    create: function () {
        // Add a sprite to be used as a play again button.
        this.playAgain = game.add.sprite(game.width / 2, game.height / 2, "playAgain");

        // Center the button image.
        this.playAgain.anchor.set(0.5, 0.5);

        // Enable for input.
        this.playAgain.inputEnabled = true;

        // Add an event listener.
        this.playAgain.events.onInputDown.add(this.restartGame, this);
    },
    restartGame: function () {
        // Restart the game by starting MainState.
        game.state.start("MainState");
    }
}