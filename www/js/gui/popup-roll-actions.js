function PopupRollActions(game) {
    var config = {
        overlay: true,
    	width: game.width - 100,
    	height: 300,
    	x: 50,
    	y: (game.height - 300) / 2,
    	originY: game.height
    };

    Popup.call(this, game, config);

    this.onActionsChoosen = new Phaser.Signal();

	this.labelActions = this.game.add.bitmapText(0, 2, "font:normal", "XXX", 20);
    this.labelActions.tint = 0x000000;

    this.labelActions.y = (this.backgroundContainer.height - 20) / 2;
    this.labelActions.originalX = (this.backgroundContainer.width/2);
    this.backgroundContainer.addChild(this.labelActions);



    let button = this.createButton("Pick", this.buttonPickClicked, this);
    button.y = (this.backgroundContainer.height - button.height) / 2;
    button.x = (this.backgroundContainer.width - button.width) / 2;

    this.labelActions.y -= button.height;
    button.y += this.labelActions.height;

    this.backgroundContainer.addChild(button);


    this.reel = this.game.add.tileSprite(0, 0, 48, 48, 'reel', 2);
    this.reel.speed = 5;
    this.backgroundContainer.addChild(this.reel);

    this.setActions(1);
};

PopupRollActions.prototype = Popup.prototype;
PopupRollActions.prototype.constructor = Popup;

PopupRollActions.prototype.update = function() {
    if (this.reel && this.reel.speed > 0) {
        this.reel.tilePosition.y -= this.reel.speed;
    }
}

PopupRollActions.prototype.setActions = function(value) {
	this.labelActions.text = value;
	this.labelActions.updateText();
	this.labelActions.x = this.labelActions.originalX - (this.labelActions.textWidth * 0.5);
}

PopupRollActions.prototype.buttonPickClicked = function() {
     if (this.reel.speed > 0) {
        let tween = this.game.add.tween(this.reel).to({speed:0}, 1500, Phaser.Easing.Circular.InOut);
        tween.onComplete.add(function() {
            /* Stop the reel on the NEXT correct value */
            let next = Math.round(Math.abs(this.reel.tilePosition.y) / 48.0) * 48;

            let tween = this.game.add.tween(this.reel.tilePosition).to({y:(next*-1)}, 500, Phaser.Easing.Elastic.InOut);
            tween.onComplete.add(function() {

                let value = ((next / 48) % 6) + 1;
                console.log(value);

                //this.onActionsChoosen.dispatch(value);
                //this.hide();

            }, this);
            tween.start();
        }, this);
        tween.start();
    }

}