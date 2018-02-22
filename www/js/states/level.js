var GAME = GAME || {};

GAME.Level = function() {};

/* Phaser */

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.createMap();

    this.createPlayer();



    this.actionsContainer = this.game.add.group();

    this.popupsContainer = this.game.add.group();

    let popup = new PopupActions(this.game);
    this.popupsContainer.addChild(popup);

    this.startTurn();

    popup.show();
};

GAME.Level.prototype.createMap = function() {
    this.map = this.game.add.tilemap('level:test', 48, 48);

    this.map.addTilesetImage('tiles', 'tileset:tiles');

    // Create layers
    this.layers = {};
    this.layers.floor = this.map.createLayer(0);

    this.layers.floor.resizeWorld();
};

GAME.Level.prototype.createPlayer = function() {
    let startingPosition = this.map.getTile(1, 0);

    console.log(startingPosition);


    this.player = this.game.add.sprite(startingPosition.worldX, startingPosition.worldY, "tileset:player");

    this.player.cameraOffsetX = -24;



    this.game.camera.follow(this.player);
};

GAME.Level.prototype.enableClick = function() {
    let playerTile = this.map.getTileWorldXY(this.player.x, this.player.y);

    let nextTile = null;
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (Math.abs(x) != Math.abs(y)) {
                nextTile = this.map.getTile(playerTile.x + x, playerTile.y + y);
                if (nextTile != null) {
                    let action = this.actionsContainer.create(nextTile.worldX, nextTile.worldY, "blank");
                    action.tint = 0xff0000;
                    action.alpha = 0.4;
                    action.width = action.height = 48;
                    action.direction = {x:x, y:y};
                    action.inputEnabled = true;
                    action.events.onInputUp.add(function() {
                        this.takeAction();

                        this.actionsContainer.removeAll(true);

                        this.player.x += (action.direction.x * 48);
                        this.player.y += (action.direction.y * 48);

                        this.endTurn();
                    }, this);
                }
            }
        }
    }
};

GAME.Level.prototype.startTurn = function() {
    this.turns = this.game.rnd.integerInRange(1, 6);
    this.getCurrentPopup().setActions(this.turns);

    this.enableClick();
};

GAME.Level.prototype.takeAction = function() {
    this.turns--;

    this.getCurrentPopup().setActions(this.turns);
};

GAME.Level.prototype.endTurn = function() {
    if (this.turns <= 0) {
        this.startTurn();
    } else {
        this.enableClick();
    }   
};

GAME.Level.prototype.getCurrentPopup = function() {
    return this.popupsContainer.getChildAt(this.popupsContainer.children.length-1);
};