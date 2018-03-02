function PopupRollActions(game) {
    var config = {
        overlay: true,
    	width: game.width - 100,
    	height: 300,
    	x: 50,
    	y: (game.height - 300) / 2,
    	originY: game.height,
        backgroundSpeed: 300,
        overlaySpeed: 100
    };

    Popup.call(this, game, config);

    this.onActionsChoosen = new Phaser.Signal();

    for (let i=0; i<2; i++) {
        let card = new Card(this.game);
        card.x = (this.backgroundContainer.width - card.width) / 2 + (i * (card.width + 10));
        card.y = (this.backgroundContainer.height - card.height) / 2;
        card.onPicked.add(this.onCardPicked, this);
        card.onFlipped.add(this.onCardFlipped, this);

        this.backgroundContainer.addChild(card);
    }

    this.nbrCards = 1;
};

PopupRollActions.prototype = Popup.prototype;
PopupRollActions.prototype.constructor = Popup;

PopupRollActions.prototype.onCardFlipped = function(card) {
   console.log("New value: " + card.value);
   this.onActionsChoosen.dispatch(card.value);
   this.hide();
};


PopupRollActions.prototype.onCardPicked = function(card) {
    if (this.nbrCards > 0) {
        this.nbrCards--;
        card.flip();
    }
};