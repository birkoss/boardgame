function PopupActions(game) {
    var config = {
    	width: game.width,
    	height: 50,
    	x: 0,
    	y: game.height - 50,
    	originY: game.height
    };

    Popup.call(this, game, config);

 	this.onMoveClicked = new Phaser.Signal();
 	this.onUseClicked = new Phaser.Signal();

	var buttons  = [
		{'label':'Move', 'callback':this.buttonMoveClicked},
		{'label':'Use', 'callback':this.buttonUseClicked},
	];

	let posX = this.backgroundContainer.width;
	buttons.forEach(function (single_button) {
		let button = this.createButton(single_button.label, single_button.callback, this);
		button.y = (this.backgroundContainer.height - button.height) / 2;
		button.x = posX - button.width - button.y;

		posX -= button.width + (button.y);

	    this.backgroundContainer.addChild(button);
	}, this);
};

PopupActions.prototype = Popup.prototype;
PopupActions.prototype.constructor = Popup;

PopupActions.prototype.buttonMoveClicked = function() {
	this.onMoveClicked.dispatch(this);
};

PopupActions.prototype.buttonUseClicked = function() {
	this.onUseClicked.dispatch(this);
};