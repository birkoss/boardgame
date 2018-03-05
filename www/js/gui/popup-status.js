function PopupStatus(game) {
    let popupHeight = 50;

    var config = {
    	width: game.width,
    	height: popupHeight,
    	x: 0,
    	y: 0,
    	originY: -popupHeight,
        backgroundSpeed: 300
    };

    Popup.call(this, game, config);

    this.init();
};

PopupStatus.prototype = Popup.prototype;
PopupStatus.prototype.constructor = Popup;

PopupStatus.prototype.init = function() {
    let sprite = this.game.add.sprite(0, 0, "tileset:items");
    sprite.anchor.set(0, 0.5);
    sprite.frame = 286;
    sprite.y = this.backgroundContainer.height / 2;
    this.backgroundContainer.addChild(sprite);

    this.labelActions = this.game.add.bitmapText(0, 2, "font:normal", "99", 20);
    this.labelActions.tint = 0x000000;

    this.labelActions.y = (this.backgroundContainer.height - 20) / 2;
    this.labelActions.x = sprite.x + sprite.width + 10;


    this.backgroundContainer.addChild(this.labelActions);

    this.setActions(0);
};

PopupStatus.prototype.setActions = function(value) {
    this.labelActions.text = value;
    this.labelActions.updateText();
  //  this.labelActions.x = this.labelActions.originalX - (this.labelActions.textWidth * 0.5);
}