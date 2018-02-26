function Map(game) {
    Phaser.Group.call(this, game);

    this.onTileRevealed = new Phaser.Signal();
    this.isClickable = false;

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
            tile.width = tile.height = 48;
            tile.x = x * tile.width;
            tile.y = y * tile.height;
            tile.tint = 0x000000;
            tile.alpha = 0.8;
            tile.events.onInputUp.add(this.onFOWClicked, this);

            this.fow.addChild(tile);
        }
    }
};

Map.prototype.clickable = function(tileX, tileY) {
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
                        this.fow.getChildAt(index).alpha = 1;
                        this.fow.getChildAt(index).inputEnabled = true;
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
        if ((single_fow.x / single_fow.width) == x && (single_fow.y / single_fow.height) == y) {
            let tilePos = new Phaser.Point(single_fow.x / single_fow.width, single_fow.y / single_fow.height);

            let tween = this.game.add.tween(single_fow).to({alpha: 0}, 300);
            tween.onComplete.add(function() {
                this.map.children.forEach(function(single_tile) {
                    if ((single_tile.x / single_tile.width) == tilePos.x && (single_tile.y / single_tile.height) == tilePos.y) {
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
        single_fow.alpha = 0.8;
    }, this);
};

Map.prototype.onFOWClicked = function(tile) {
    this.fow.forEach(function(single_fow) {
        single_fow.inputEnabled = false;
    }, this);

    this.reveal(tile.x / tile.width, tile.y / tile.height);
};