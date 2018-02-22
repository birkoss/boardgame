function Popup(game, config) {
    Phaser.Group.call(this, game);

    this.config = {
        overlay: false,
        width: this.game.width - 100, 
        height: this.game.height - 100,
        x: 50,
        y: 50,
        originY: -this.game.height
    };

    /* Overwrite some values */
    for (let key in config) {
        this.config[key] = config[key];
    }

    if (this.config.overlay) {
        this.createOverlay();
    }
    
    this.createBackground();

    this.fixedToCamera = true;
};

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.createOverlay = function() {
    this.overlayContainer = this.game.add.group();
    this.addChild(this.overlayContainer);

    let background = this.game.make.sprite(0, 0, "blank");
    background.tint = 0x000000;
    background.width = this.game.width;
    background.height = this.game.height;
    background.inputEnabled = true;
   // background.fixedToCamera = true;

    background.alpha = 0.8;

    this.overlayContainer.addChild(background);
}

Popup.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    let background = this.game.make.sprite(0, 0, "blank");
    background.tint = 0xffffff;
    background.width = this.config.width;
    background.height = this.config.height;
    background.inputEnabled = true;
    background.x = 0;
    background.y = 0;

    this.backgroundContainer.x = this.config.x;
    this.backgroundContainer.y = this.config.y;
    this.backgroundContainer.addChild(background);
}

Popup.prototype.show = function() {
    if (this.overlayContainer != null) {
        this.overlayContainer.getChildAt(0).alpha = 0;
    }

    let backgroundY = this.backgroundContainer.y;
    this.backgroundContainer.y = this.config.originY;

    if (this.overlayContainer != null) {
        let tween = this.game.add.tween(this.overlayContainer.getChildAt(0)).to({alpha:0.8}, 500);
        tween.onComplete.add(function() {
            this.showBackground(backgroundY);
        }, this);
        tween.start();
    } else {
        this.showBackground(backgroundY);
    }
}

Popup.prototype.showBackground = function(backgroundY) {
    let tween = this.game.add.tween(this.backgroundContainer).to({y:backgroundY}, 800, Phaser.Easing.Bounce.Out);
    tween.start();
}

Popup.prototype.createButton = function(buttonLabel, callback, context) {
    let button = this.game.add.button(0, 0, "gui:button", callback, context, 0, 1, 0, 1);

    let label = this.game.add.bitmapText(0, 2, "font:normal", buttonLabel, 10);
    label.tint = 0xffffff;
    label.x = (button.width - label.width)/2;
    label.y = (button.height - label.height)/2;

    button.addChild(label);

    return button;
}

Popup.prototype.hide = function() {
    let tween = this.game.add.tween(this.backgroundContainer).to({y:this.config.originY}, 800, Phaser.Easing.Bounce.Out);
    tween.onComplete.add(function() {
        this.destroy();
    }, this);
    tween.start();
}
