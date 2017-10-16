var game;
window.onload = function () {
    isMobile = navigator.userAgent.indexOf("Mobile");

    if (isMobile == -1) {
        game = new Phaser.Game(640, 480, Phaser.AUTO, "remittance_yeti");
    } else {
        game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "remittance_yeti");
        console.log("Mobile");
    }

    game.state.add("OverState", overState);
    game.state.add("MainState", mainState);
    game.state.start("MainState");
}