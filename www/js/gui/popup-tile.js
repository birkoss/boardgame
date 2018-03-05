function PopupTile(game, tile) {
    var config = {
        overlay: true,
    	width: game.width - 100,
    	height: 300,
    	x: 50,
    	y: (game.height - 300) / 2,
    	originY: game.height,
        backgroundSpeed: 250,
        overlaySpeed: 100
    };

    Popup.call(this, game, config);

    this.tile = tile;

    this.buttons = [];
    let button = this.game.add.button(0, 0, "gui:button", this.onButtonCloseClicked, this, 0, 1, 0, 1);
    this.backgroundContainer.addChild(button);
    button.y = this.backgroundContainer.height - button.height - 10;
    button.x = (this.backgroundContainer.width - button.width) / 2;
    this.buttons.push(button);

    let label = this.game.add.bitmapText(0, 2, "font:normal", "Close", 10);
    label.tint = 0xffffff;
    label.x = (button.width-label.width) / 2;
    label.y = ((button.height-label.height) / 2) - 2;
    button.addChild(label);

    let rnd = this.game.rnd.integerInRange(1, 100);

    let text = this.game.add.bitmapText(0, 2, "font:normal", "Close", 10);
    switch (this.tile.status) {
        case 'good':
            if (rnd > 90) {
                text.text = "You find a chest!";
            } else if (rnd > 70) {
                text.text = "Welcome to the shop!";
            } else if (rnd > 45) {
                text.text = "You got X turns!";
            } else {
                text.text = "You are healed!";
            }
            break;
        case 'bad':
            if (rnd > 90) {
                text.text = "Return to start!";
            } else if (rnd > 55) {
                text.text = "You lost X turns!";
            } else {
                text.text = "You are damaged!";
            }
            break;
        case 'neutral':
            if (rnd > 90) {
                text.text = "Warp Randomly!";
            } else if (rnd > 55) {
                text.text = "New enemies!";
            } else {
                text.text = "Reset tiles!";
            }
            break;
    }
    text.tint = 0x000000;
    text.x = (this.backgroundContainer.width-text.width) / 2;
    text.y = ((this.backgroundContainer.height-text.height) / 2) - 2;
    this.backgroundContainer.addChild(text);
};

PopupTile.prototype = Popup.prototype;
PopupTile.prototype.constructor = Popup;

PopupTile.prototype.onButtonCloseClicked = function(button) {
    this.hide();
};