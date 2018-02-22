var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype.preload = function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
    this.preloadBar.anchor.set(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level:test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('tileset:tiles', 'assets/sprites/tiles.png');
    this.load.image('tileset:player', 'assets/sprites/player.png');
    
    this.load.image('blank', 'assets/sprites/blank.png');


    this.load.bitmapFont('font:outline', 'assets/fonts/guiOutline.png', 'assets/fonts/guiOutline.xml');
    this.load.bitmapFont('font:normal', 'assets/fonts/gui.png', 'assets/fonts/gui.xml');
};

GAME.Preload.prototype.create = function() {
    GAME.json = {};

    this.state.start("Level");
};