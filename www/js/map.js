function Map(game) {

    this.cheat = false;

    Phaser.Group.call(this, game);

    this.onTileRevealed = new Phaser.Signal();

    this.init();

    this.generate();

    this.createFOW();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createFOW = function() {
    this.fow = this.game.add.group();
    this.addChild(this.fow);

    for (let y=0; y<5; y++) {
        for (let x=0; x<5; x++) {
            let tile = this.create(0, 0, 'blank');
            tile.anchor.set(0.5, 0.5);
            tile.width = tile.height = 48;
            tile.grid = new Phaser.Point(x, y);
            tile.x = (x * tile.width) + (tile.width/2);
            tile.y = (y * tile.height) + (tile.height/2);
            tile.tint = 0x000000;
            tile.alpha = (this.cheat ? 0.8 : 1);

            this.fow.addChild(tile);
        }
    }
};

Map.prototype.clickable = function(tileX, tileY) {
    this.actions = [];

    let tiles = 0;
    let tmpX, tmpY = 0;
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (Math.abs(x) != Math.abs(y)) {
                tmpX = x + tileX;
                tmpY = y + tileY;
                if (tmpX >= 0 && tmpX < 5 && tmpY >= 0 && tmpY < 5) {
                    let index = (tmpY * 5) + tmpX;
                    if (this.fow.getChildAt(index).alpha > 0) {
                        if (this.cheat) {
                            this.fow.getChildAt(index).alpha = 0.4;
                        }

                        let action = this.create(0, 0, 'tileset:effectsSmall');
                        action.anchor.set(0.5, 0.5);
                        action.frame = 70;
                        action.x = this.fow.getChildAt(index).x;
                        action.y = this.fow.getChildAt(index).y;
                        action.grid = new Phaser.Point(tmpX, tmpY);
                        action.inputEnabled = true;
                        action.events.onInputUp.add(this.onActionClicked, this);
                        this.actions.push(action);

                        tiles++;
                    }
                }
            }
        }
    }
    return tiles;
};

Map.prototype.init = function() {
    this.map = this.game.add.group();
    this.addChild(this.map);

    for (let y=0; y<5; y++) {
        for (let x=0; x<5; x++) {
            let tile = new Tile(this.game, x, y);
            this.map.addChild(tile);
        }
    }
};

Map.prototype.generate = function() {
    /* Starting points */
    let c = new Phaser.Point(2, 4);
    this.map.getChildAt((c.y * 5) + c.x).setType("start");

    /* Disabled 2 tiles */
     let tiles = this.getEmptyTiles();
     for (let i=0; i<2; i++) {
        Phaser.ArrayUtils.shuffle(tiles);
        tiles.shift().setType("disabled");
     }

     /* Place 2 keys */
     for (let i=0; i<2; i++) {
        Phaser.ArrayUtils.shuffle(tiles);
        tiles.shift().setType("key");
     }

     /* Place 1 chest */
    Phaser.ArrayUtils.shuffle(tiles);
    tiles.shift().setType("chest");

    /* Place remaining weapons */
    let weapons = ['sword', 'bow', 'axe', 'rod'];
    weapons.forEach(function(single_weapon) {
        for (let i=0; i<4; i++) {
            Phaser.ArrayUtils.shuffle(tiles);
            let tile = tiles.shift();
            tile.setWeapon(single_weapon);
            tile.setType("enemy");
        }
    }, this);
};

Map.prototype.getEmptyTiles = function() {
    return this.map.children.filter(function (single_tile) {
        return (single_tile.type == "");
    }, this);
};

Map.prototype.reveal = function(x, y) {
    this.fow.forEach(function(single_fow) {
        if (single_fow.grid.x == x && single_fow.grid.y == y) {
            let tween = this.game.add.tween(single_fow).to({alpha: 0}, 300);
            tween.onComplete.add(function() {
                this.map.children.forEach(function(single_tile) {
                    if (single_tile.grid.x == single_fow.grid.x && single_tile.grid.y == single_fow.grid.y) {
                        this.onTileRevealed.dispatch(single_tile);
                    }
                }, this);               
            }, this);
            tween.start();
        }
    }, this);
};

Map.prototype.reset = function() {
    this.fow.forEach(function(single_fow) {
        single_fow.alpha = (this.cheat ? 0.8 : 1);
    }, this);
};

Map.prototype.onActionClicked = function(tile) {
    this.actions.forEach(function(single_action) {
        single_action.destroy();
    }, this);

    console.log(tile.grid);

    this.reveal(tile.grid.x, tile.grid.y);
};