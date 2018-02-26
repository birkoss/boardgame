function PopupWeapon(game) {
    let popupHeight = 80;

    var config = {
    	width: game.width,
    	height: popupHeight,
    	x: 0,
    	y: 0,
    	originY: -popupHeight,
        backgroundSpeed: 300
    };

    Popup.call(this, game, config);

    this.onWeaponChoosen = new Phaser.Signal();

    this.init();
};

PopupWeapon.prototype = Popup.prototype;
PopupWeapon.prototype.constructor = Popup;

PopupWeapon.prototype.init = function() {
    let weapons = ['sword', 'bow', 'axe', 'rod'];
    weapons.forEach(function(single_weapon) {
        let tile = new Tile(this.game, this.backgroundContainer.children.length, 0);
        tile.setWeapon(single_weapon);
        tile.setType("enemy");

        tile.enableClick();
        tile.onClicked.add(this.selectTile, this);

        this.backgroundContainer.add(tile);
    }, this);
};

PopupWeapon.prototype.selectTile = function(tile) {
    this.backgroundContainer.children.forEach(function(single_tile) {
        single_tile.alpha = 1;
    }, this);

    tile.alpha = 0.2;
   
   this.onWeaponChoosen.dispatch(tile.weapon);
};

PopupWeapon.prototype.selectWeapon = function(weapon) {
    this.backgroundContainer.children.forEach(function(single_tile) {
        if (single_tile.weapon == weapon) {
            this.selectTile(single_tile);
        }
    }, this);
};