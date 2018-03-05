var GAME = GAME || {};

GAME.Level = function() {};

/* Phaser */

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.createMap();

    this.createPlayer();

    this.actionsContainer = this.game.add.group();

    this.popupsContainer = this.game.add.group();
    this.popups = {};

    this.popups.status = new PopupStatus(this.game);
    this.popupsContainer.addChild(this.popups.status);
    this.popups.status.show();


    this.popups.actions = new PopupActions(this.game);
    this.popups.actions.onUseClicked.add(this.popupActionsUseClicked, this);
    this.popups.actions.onMoveClicked.add(this.popupActionsMoveClicked, this);
    this.popupsContainer.addChild(this.popups.actions);
    this.popups.actions.show();


    //this.startTurn();


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






    this.enemies = [];
    let e = new Unit(this.game, 'rat');
    e.placeTo(5, 2);
    this.enemies.push(e);
    



    let startingPosition = this.map.getTile(2, 2);
    console.log("Starting Position: ", startingPosition);

    this.player = new Unit(this.game, 'knight');
    this.player.onMoved.add(this.onPlayerMoved, this);

    if (startingPosition) {
        this.player.placeTo(4, 2);
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
                    let enemy = this.enemyAt(nextTile.x, nextTile.y);
                    let action = new Action(this.game, nextTile.worldX, nextTile.worldY, (enemy != null && enemy.isAlive() ? "attack" : "move"));

                    this.actionsContainer.addChild(action);
                    action.direction = {x:x, y:y};
                    action.inputEnabled = true;
                    action.events.onInputUp.add(function() {
                        this.takeAction(action);
                        
                        this.actionsContainer.removeAll(true);
                    }, this);
                }
            }
        }
    }
};

GAME.Level.prototype.enemyAt = function(x, y) {
    let unit = null;
    this.enemies.forEach(function(single_enemy) {
        if (single_enemy.grid.x == x && single_enemy.grid.y == y) {
            unit = single_enemy;
        }
    }, this);
    return unit;
};

GAME.Level.prototype.startTurn = function() {
    this.popups.status.setActions(this.turns);

    this.enableClick();
};

GAME.Level.prototype.takeAction = function(action) {
    console.log(action);

    this.turns--;
    this.popups.status.setActions(this.turns);

    switch(action.effect) {
        case 'attack':
            let enemy = this.enemyAt(this.player.grid.x + action.direction.x, this.player.grid.y + action.direction.y);

            this.popups.battle = new PopupBattle(this.game);
            this.popups.battle.setEnemy(enemy);
            this.popups.battle.setTurns(this.turns);
            this.popups.battle.onBattleCompleted.add(this.onPopupBattleResolved, this);
            this.popups.battle.show();
            break;
        default:
            this.player.moveTo(this.player.grid.x + action.direction.x, this.player.grid.y + action.direction.y);
    }
};

GAME.Level.prototype.endTurn = function() {
    if (this.turns <= 0) {
        console.log("SHOW");
        this.popups.actions.show();
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
    this.popups.actions.hide();
    this.turns = turns;

    this.startTurn();
};

GAME.Level.prototype.onPlayerMoved = function(unit) {
    this.endTurn();
};

GAME.Level.prototype.onPopupBattleResolved = function(status, data) {

    let enemy = this.enemyAt(data.tile.x, data.tile.y);
    enemy.setHealth(data.enemy.health);

    this.turns = Math.max(0, data.turns);

    if (status == 'win') {
        this.game.time.events.add(1000, function() {
            this.player.moveTo(data.tile.x, data.tile.y);
        }, this);
    } else if(status == 'lose') {
        alert('GAME OVER');
    } else if(status == 'draw') {
        this.endTurn();
    }
};