var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype.preload = function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
    this.preloadBar.anchor.set(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level:test', 'assets/maps/test.csv', null, Phaser.Tilemap.CSV);
    //this.load.tilemap('level:test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.spritesheet('tileset:world', 'assets/tilesets/world.png', 48, 48);
    this.load.spritesheet('tileset:items', 'assets/tilesets/items.png', 32, 32);
    this.load.spritesheet('tileset:units', 'assets/tilesets/units.png', 48, 48);
    this.load.spritesheet('tileset:effectsSmall', 'assets/tilesets/effectsSmall.png', 48, 48);
    this.load.spritesheet('tileset:effectsLarge', 'assets/tilesets/effectsLarge.png', 64, 64);

    this.load.image('blank', 'assets/sprites/blank.png');

    this.load.image('reel', 'assets/sprites/reel.png');


    this.load.bitmapFont('font:outline', 'assets/fonts/guiOutline.png', 'assets/fonts/guiOutline.xml');
    this.load.bitmapFont('font:normal', 'assets/fonts/gui.png', 'assets/fonts/gui.xml');

    this.load.spritesheet('gui:button', 'assets/sprites/button.png', 100, 32);

    this.load.json("data:units", "assets/data/units.json");
};

GAME.Preload.prototype.create = function() {
    GAME.json = {};
    GAME.json['units'] = this.cache.getJSON("data:units");

    this.state.start("Level");
};