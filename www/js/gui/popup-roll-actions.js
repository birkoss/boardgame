function PopupRollActions(game) {
    var config = {
        overlay: true,
    	width: game.width - 100,
    	height: 300,
    	x: 50,
    	y: (game.height - 300) / 2,
    	originY: game.height,
        backgroundSpeed: 300
    };

    Popup.call(this, game, config);

    this.onActionsChoosen = new Phaser.Signal();

    this.reel = new Reel(this.game);
    this.reel.x = (this.backgroundContainer.width - this.reel.width) / 2;
    this.reel.y = (this.backgroundContainer.height - this.reel.height) / 2;
    this.backgroundContainer.addChild(this.reel);
    this.reel.onValueChanged.add(this.slotValuePicked, this);

};

PopupRollActions.prototype = Popup.prototype;
PopupRollActions.prototype.constructor = Popup;

PopupRollActions.prototype.slotValuePicked = function(slot, value) {
   console.log("New value: " + value);
   this.onActionsChoosen.dispatch(value);
   this.hide();
};