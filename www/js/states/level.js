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
    popup.onUseClicked.add(this.popupActionsUseClicked, this);
    popup.onMoveClicked.add(this.popupActionsMoveClicked, this);
    this.popupsContainer.addChild(popup);



    //this.startTurn();

    popup.show();

    this.debug = this.game.add.bitmapText(0, 2, "font:normal", "xxxx", 10);
    this.debug.tint = 0xff00ff;
    this.debug.fixedToCamera = true;

    this.updateDebug();
};

GAME.Level.prototype.updateDebug = function() {
    this.debug.text = this.player.x + "x" + this.player.y + " | " + this.game.camera.x + "x" + this.game.camera.y + " | " + this.map.layers[0].x + "x" + this.map.layers[0].y + " | " + this.map.layers[0].data[15][5].worldX + "x" + this.map.layers[0].data[15][5].worldY;
};

GAME.Level.prototype.createMap = function() {
    this.map = this.game.add.tilemap('level:test', 48, 48);

    this.map.addTilesetImage('world', 'tileset:world');

    // Create layers
    this.layers = {};
    this.layers.floor = this.map.createLayer(0);

    this.layers.floor.resizeWorld();

    this.map.setCollisionByIndex(887);
};

GAME.Level.prototype.createPlayer = function() {
    let startingPosition = this.map.getTile(4, 15);

    console.log("Starting Position: ", startingPosition);

    this.player = new Unit(this.game, 'knight');
    this.player.onMoved.add(this.onPlayerMoved, this);

    if (startingPosition) {
        this.player.placeTo(4, 15);
    }

    this.game.camera.follow(this.player);//, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
};

GAME.Level.prototype.enableClick = function() {
    let nextTile = null;
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (Math.abs(x) != Math.abs(y)) {
                nextTile = this.map.getTile(this.player.grid.x + x, this.player.grid.y + y);
                if (nextTile != null) {
                    let action = new Action(this.game, nextTile.worldX, nextTile.worldY);
                    this.actionsContainer.addChild(action);
                    action.direction = {x:x, y:y};
                    action.inputEnabled = true;
                    action.events.onInputUp.add(function() {
                        this.takeAction();
                        
                        this.actionsContainer.removeAll(true);

                        this.player.moveTo(this.player.grid.x + action.direction.x, this.player.grid.y + action.direction.y);
                    }, this);
                }
            }
        }
    }
};

GAME.Level.prototype.startTurn = function() {
console.log(this.getCurrentPopup());
    this.getCurrentPopup().setActions(this.turns);

    this.enableClick();
};

GAME.Level.prototype.takeAction = function() {
    this.turns--;

    this.getCurrentPopup().setActions(this.turns);
};

GAME.Level.prototype.endTurn = function() {
    if (this.turns <= 0) {
        this.getCurrentPopup().hide();
    } else {
        this.enableClick();
    }   
};

GAME.Level.prototype.getCurrentPopup = function() {
    return this.popupsContainer.getChildAt(this.popupsContainer.children.length-1);
};

GAME.Level.prototype.popupActionsUseClicked = function() {

};

GAME.Level.prototype.popupActionsMoveClicked = function() {
    /*
    let popup = new PopupMove(this.game);
    this.popupsContainer.addChild(popup);

    this.startTurn();

    popup.show();
    */

    let popup = new PopupRollActions(this.game);
    popup.onActionsChoosen.add(this.onPopupRollActionsChoosen, this);
    popup.show();
};

GAME.Level.prototype.onPopupRollActionsChoosen = function(turns) {
    this.turns = turns;
    let popup = new PopupMove(this.game);
    this.popupsContainer.addChild(popup);
    this.startTurn();
    popup.show();
};

GAME.Level.prototype.onPlayerMoved = function(unit) {
    this.endTurn();
};