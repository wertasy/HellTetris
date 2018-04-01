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

        game.load.image('bottom', 'assets/container.png');
        game.load.image('wall', 'assets/container.png');
        game.load.image('skin', 'assets/skin.png');
        game.load.image('lBox', 'assets/L.png');
        game.load.image('tBox', 'assets/T.png');
        game.load.image('zBox', 'assets/Z.png');
        game.load.image('oBox', 'assets/O.png');
        game.load.image('iBox', 'assets/I.png');
        game.load.physics('physicsData', 'assets/sprites.json');
    };
    this.create = function() {
        game.state.start('play');
    };
}
game.States.play = function() {
    var player, playerPoint = 1;
    var skin;
    var gameOverText;
    var overGroup, gameOver = false;
    var iBox, lBox, oBox, tBox, xBox;
    var x1, y1;
    this.create = function() {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 0;
        game.physics.p2.bounce = 0;
        game.physics.p2.gravity.y = 30;

        wall = game.add.sprite(game.world.width / 2, game.world.height / 2, 'wall');
        game.physics.p2.enable(wall, false);
        wall.body.static = true;
        wall.body.clearShapes();
        wall.body.loadPolygon('physicsData', 'wall');

        bottom = game.add.sprite(game.world.width / 2, game.world.height / 2, 'bottom');
        game.physics.p2.enable(bottom, false);
        bottom.body.static = true;
        bottom.body.clearShapes();
        bottom.body.loadPolygon('physicsData', 'bottom');

        skin = game.add.sprite(0, 0, 'skin');

        //随机产生box
        createBox = function() {
            var random = Math.floor(Math.random() * 5);
            switch (random) {
                case 0:
                    player = game.add.sprite(game.world.width / 2, 70, 'tBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'T');
                    break;
                case 1:
                    player = game.add.sprite(game.world.width / 2, 70, 'lBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'L');
                    break;
                case 2:
                    player = game.add.sprite(game.world.width / 2, 70, 'oBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'O');
                    break;
                case 3:
                    player = game.add.sprite(game.world.width / 2, 70, 'zBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'Z');
                    break;
                case 4:
                    player = game.add.sprite(game.world.width / 2, 90, 'iBox');
                    game.physics.p2.enable(player, false);
                    player.body.clearShapes();
                    player.body.loadPolygon('physicsData', 'I');
                    break;
            }
            player.body.damping = 0.6;
            player.body.onBeginContact.addOnce(blockHit, this);
        };
        blockHit = function(body, bodyB, shapeA, shapeB, equation) {
            console.log(player.top);
            if (player.top < 30) {
                gameOver = true;
                game.input.onDown.add(
                    function() {
                        game.state.start('play');
                        gameOver = false;
                        playerPoint = 0;
                        gameOverText = null;
                    }
                );
            }
            if (!gameOver) {
                if (body) {
                    if (body.sprite.key != 'wall') {
                        playerPoint++;
                        createBox();
                    } else {
                        player.body.onBeginContact.removeAll();
                        player.body.onBeginContact.addOnce(blockHit, this);
                    }
                }
            }
        };

        createBox();
        cursors = game.input.keyboard.createCursorKeys();

        keyDown = function() {
            player.body.angle = player.body.angle + 90;
        }


        game.input.onTap.add(function(pointer, doubleTap) {
            if (doubleTap) {
                player.body.angle = player.body.angle + 90;
            } else {
                console.log(pointer);
                if (pointer.x < game.world.width / 2) {
                    player.body.velocity.x -= 30;
                } else if (pointer.x > game.world.width / 2) {
                    player.body.velocity.x += 30;
                }
            }
        });

        cursors.up.onDown.add(keyDown, this);
    };


    this.update = function() {
        //player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x -= 2;
        } else if (cursors.right.isDown) {
            player.body.velocity.x += 2;
        } else if (cursors.down.isDown) {
            player.body.y += 4;
        }
        if (gameOver) {
            createGameOverText();
        }
    };
    this.render = function() {}

    function createGameOverText() {
        if (gameOverText == null) {
            if (player.body.y == 50) {
                player.kill();
                point.text = playerPoint;
            }
            gameOverText = game.add.text(game.width / 2, game.height / 2, '游戏结束 !!\n得分:' + playerPoint + '\n点击屏幕重新开始');
            gameOverText.anchor.setTo(0.5);
            gameOverText.font = 'Arial Black';
            gameOverText.fontWeight = 'bold';
            gameOverText.fill = 'black';
            gameOverText.fontSize = 40;
            gameOverText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 5);

        }
    }
};
game.state.add('boot', game.States.boot);
game.state.add('load', game.States.load);
game.state.add('play', game.States.play);
game.state.start('boot');