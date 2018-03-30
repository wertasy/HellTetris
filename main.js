var game = new Phaser.Game(360, 640, Phaser.CANVAS, '');

game.States = {};
game.States.boot = function() {
    this.preload = function() {
        game.load.image('loading', 'assets/loading.gif');
    };
    this.create = function() {
        game.state.start('load');
    };
}
game.States.load = function() {
    this.preload = function() {
        var preloadSprite = game.add.sprite(game.width / 2 - 110, game.height / 2, 'loading');
        game.load.setPreloadSprite(preloadSprite);

        game.load.image('container', 'assets/container.png');
        game.load.image('tetrisL', 'assets/L.png');
        game.load.image('tetrisT', 'assets/T.png');
        game.load.image('tetrisZ', 'assets/Z.png');
        game.load.image('tetrisO', 'assets/O.png');
        game.load.image('tetrisI', 'assets/I.png');
        game.load.physics('physicsData', 'assets/sprites.json');
    };
    this.create = function() {
        game.state.start('play');
    };
}
game.States.play = function() {
    var container;
    var falltetris;
    var hasStart = true;
    this.preload = function() {};
    this.create = function() {
        game.physics.startSystem(Phaser.Physics.BOX2D);
        game.physics.box2d.setBoundsToWorld();
        game.physics.box2d.restidution = 0.15;
        game.physics.box2d.friction = 0;
        game.physics.box2d.gravity.y = 20;

        var containerVertices = [58, 0, 58, 378, 60, 394, 65, 408, 72, 420, 83, 434, 96, 446, 110, 455, 123, 462, 138, 468, 154, 472, 168, 474, 180, 475,
            192, 474, 206, 472, 222, 468, 237, 462, 250, 455, 264, 446, 277, 434, 288, 420, 295, 408, 300, 394,
            304, 378, 304, 0
        ];
        container = game.add.sprite(0, 0, 'container');
        var containerBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
        containerBody.setChain(containerVertices);

        falltetris = game.add.sprite(game.width / 2, 200, 'tetrisT');
        game.physics.box2d.enable(falltetris);
        falltetris.body.clearFixtures();
        falltetris.body.loadPolygon('physicsData', 'T', falltetris);

        cursors = game.input.keyboard.createCursorKeys();
        game.input.onDown.add(this.move, this);
    };
    this.move = function() {
        if (game.input.x < game.width / 2) {
            falltetris.body.velocity.x = -50;
        } else {
            falltetris.body.velocity.x = 50;
        }
    };
    this.update = function() {
        falltetris.body.velocity.x = 0;

        if (cursors.left.isDown) {
            falltetris.body.velocity.x = -50;
        } else if (cursors.right.isDown) {
            falltetris.body.velocity.x = 50;
        }

        if (cursors.up.isDown) {
            falltetris.body.moveUp(200);
        } else if (cursors.down.isDown) {
            falltetris.body.moveDown(200);
        }

    };
    this.render = function() {
        game.debug.box2dWorld();
    }
}

game.state.add('boot', game.States.boot);
game.state.add('load', game.States.load);
game.state.add('play', game.States.play);
game.state.start('boot');