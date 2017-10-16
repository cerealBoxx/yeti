let mainState = {
    preload: function () {
        game.load.image("ground", "images/ground.png");
        game.load.image("block", "images/block.png");
        game.load.image("bird", "images/bird.png");
        game.load.image("playAgain", "images/playAgain.png");
        game.load.image("clouds", "images/clouds.png");
        game.load.atlasJSONHash('hero', 'images/explorer.png', 'images/explorer.json');
    },
    create: function () {
        this.clickLock = false;
        this.power = 25;

        // Turn the background sky blue.
        game.stage.backgroundColor = "#bde5dd";

        // Add the ground.
        this.ground = game.add.sprite(0, game.height * .9, "ground");

        // Add the hero in.
        this.hero = game.add.sprite(game.width * .2, this.ground.y, "hero");

        // Make animations.
        this.hero.animations.add("die", this.makeArray(0, 10), 12, false);
        this.hero.animations.add("jump", this.makeArray(20, 30), 12, false);
        this.hero.animations.add("run", this.makeArray(30, 40), 12, true);
        this.hero.animations.play("run");
        this.hero.width = game.width / 12;
        this.hero.scale.y = this.hero.scale.x;
        this.hero.anchor.set(0.5, 1);

        // Add the clouds.
        this.clouds = game.add.sprite(0, 0, "clouds");
        this.clouds.width = game.width;

        // Start the physics engine.
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Enable the hero for physics.
        game.physics.enable(this.hero, Phaser.Physics.ARCADE);
        game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.hero.body.gravity.y = 500;
        this.hero.body.collideWorldBounds = true;
        this.ground.body.immovable = true;

        // Record the initial position.
        this.startY = this.hero.y;

        // Set listeners.
        game.input.onDown.add(this.doJump, this);
        game.input.onTap.add(this.doJump, this);
        game.input.on
        game.input.keyboard
            .addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.add(this.doJump, this);
        this.blocks = game.add.group();
        this.makeBlocks();
        this.makeBird();
    },
    makeArray: function (start, end) {
        let myArray = [];
        for (let i = start; i < end; i++) {
            myArray.push(i);
        }
        return myArray;
    },
    doJump: function () {
        if (this.hero.y != this.startY) {
            return;
        }

        this.hero.body.velocity.y = -this.power * 12;
        this.hero.animations.play("jump");
    },
    makeBlocks: function () {
        this.blocks.removeAll();
        let wallHeight = game.rnd.integerInRange(1, 1);
        for (let i = 0; i < wallHeight; i++) {
            let block = game.add.sprite(0, -i * 50, "block");
            this.blocks.add(block);
        }
        this.blocks.x = game.width - this.blocks.width
        this.blocks.y = this.ground.y - 50;

        // Loop through each block and apply physics.
        this.blocks.forEach(function (block) {

            // Enable physics.
            game.physics.enable(block, Phaser.Physics.ARCADE);
            block.body.velocity.x = -250;

            // Apply some gravity to the block.
            // Not too much or the blocks will bounce against each other.
            // block.body.gravity.y = 4;
            
            // Set the bounce so the blocks will react to the runner.
            // block.body.bounce.set(1, 1);
        });
    },
    makeBird: function () {
        // If the bird already exists destory it.
        if (this.bird) {
            this.bird.destroy();
        }

        // Pick a number at the top of the screen between
        // 10 percent and 40 percent of the height of the screen.
        let birdY = game.rnd.integerInRange(game.height * .1, game.height * .4);

        // Add the bird sprite to the game.
        this.bird = game.add.sprite(game.width + 100, birdY, "bird");

        // Enable the sprite for physics.
        game.physics.enable(this.bird, Phaser.Physics.ARCADE);

        // Set the x velocity at -200 which is a little faster than the blocks.
        this.bird.body.velocity.x = -200;

        // Set the bounce for the bird.
        this.bird.body.bounce.set(2, 2);
    },
    onGround() {
        if (this.hero) {
            this.hero.animations.play("run");
        }
    },
    update: function () {
        // Collide the hero with the ground.
        game.physics.arcade.collide(this.hero, this.ground, this.onGround, null, this);

        // Collide the hero with the blocks.
        game.physics.arcade.collide(this.hero, this.blocks, this.delayOver, null, this);

        // Collide the blocks with the ground.
        game.physics.arcade.collide(this.ground, this.blocks);

        // When only specifying one group, all children in that
        // group will collide with each other.
        game.physics.arcade.collide(this.blocks);

        // Colide the hero with the bird.
        game.physics.arcade.collide(this.hero, this.bird, this.delayOver, null, this);

        // Get the first child.
        let fchild = this.blocks.getChildAt(0);

        // If off the screen reset the blocks.
        if (fchild.x < -game.width) {
            this.makeBlocks();
        }

        // If the bird has flown off screen reset it.
        if (this.bird.x < 0) {
            this.makeBird();
        }
        if (this.hero.y < this.hero.height) {
            this.hero.body.velocity.y = 200;
            this.delayOver();
        }
    },
    delayOver: function () {
        this.clickLock = true;
        if (this.hero) {
            this.hero.animations.play("die");
            this.hero.body.velocity.y = 100;
        }
        game.time.events.add(Phaser.Timer.SECOND, this.gameOver, this);
    },
    gameOver: function () {
        game.state.start("OverState");
    }
}