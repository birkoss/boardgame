function PopupActions(game) {
    var config = {
    	width: game.width,
    	height: 50,
    	x: 0,
    	y: game.height - 50,
    	originY: game.height
    };

    Popup.call(this, game, config);

	this.labelActions = this.game.add.bitmapText(0, 2, "font:normal", "XXX", 20);
    this.labelActions.tint = 0x000000;

    this.labelActions.y = (this.backgroundContainer.height - 20) / 2;
    this.labelActions.originalX = (this.backgroundContainer.width/2);

    this.backgroundContainer.addChild(this.labelActions);

    this.setActions(1);
};

PopupActions.prototype = Popup.prototype;
PopupActions.prototype.constructor = Popup;

PopupActions.prototype.setActions = function(value) {
	this.labelActions.text = value;
	this.labelActions.updateText();
	this.labelActions.x = this.labelActions.originalX - (this.labelActions.textWidth * 0.5);
}