function PopupBattle(game) {
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


    this.buttons = [];
    let button = this.game.add.button(0, 0, "gui:button", this.onButtonAttackClicked, this, 0, 1, 0, 1);
    this.backgroundContainer.addChild(button);
    button.y = this.backgroundContainer.height - button.height - 10;
    button.x = (this.backgroundContainer.width - button.width) / 2;
    this.buttons.push(button);

    let label = this.game.add.bitmapText(0, 2, "font:normal", "Attack", 10);
    label.tint = 0xffffff;
    label.x = (button.width-label.width) / 2;
    label.y = ((button.height-label.height) / 2) - 2;
    button.addChild(label);

    this.onBattleCompleted = new Phaser.Signal();
};

PopupBattle.prototype = Popup.prototype;
PopupBattle.prototype.constructor = Popup;

PopupBattle.prototype.setTile = function(tile) {
    this.tile = tile;

    this.enemy = new Unit(this.game);
    this.enemy.x = this.backgroundContainer.width - 50;
    this.enemy.y = 100;
    this.backgroundContainer.addChild(this.enemy);
};

PopupBattle.prototype.setPlayer = function(unit) {
    this.player = new Unit(this.game);
    this.player.x = 50;
    this.player.y = 100;
    this.player.health = unit.health;
    this.backgroundContainer.addChild(this.player);
};

PopupBattle.prototype.startAttack = function() {
    let units = [{
        unit:this.player,
        direction: 1
    },{
        unit:this.enemy,
        direction: -1
    }];

    let labels = [];
    units.forEach(function(single_unit) {
        single_unit.unit.damage = this.game.rnd.integerInRange(1, 6);

        let label = this.game.add.bitmapText(0, 2, "font:normal", single_unit.unit.damage, 10);
        labels.push(label);

        label.tint = 0x000000;
        label.x = single_unit.unit.x;
        label.y = (single_unit.unit.y - (single_unit.unit.height/2) - 30);
        this.backgroundContainer.addChild(label);
    }, this);

    let middle = ((this.enemy.x - this.player.x) / 2) - (this.player.width * .25);

    units.forEach(function(single_unit) {
        single_unit.unit.originX = single_unit.unit.x;

        let tween = this.game.add.tween(single_unit.unit).to({x:single_unit.unit.x+(middle * single_unit.direction)}, 500);
        tween.onComplete.add(function() {
            if (this.game.tweens.getAll().length == 1) {
                labels.forEach(function(single_label) {
                    single_label.destroy();
                }, this);
                this.generateAttack();
            }
        }, this);
        tween.start();
    }, this);
};

PopupBattle.prototype.generateAttack = function() {
    this.player.takeDamage(this.enemy.damage);
    this.enemy.takeDamage(this.player.damage);

    this.endAttack();
};

PopupBattle.prototype.endAttack = function() {
    let units = [{
        unit:this.player,
        direction: 1
    },{
        unit:this.enemy,
        direction: -1
    }];

    let survivors = 0;
    units.forEach(function(single_unit) {
        if (single_unit.unit.isAlive()) {
            survivors++;
            let tween = this.game.add.tween(single_unit.unit).to({x:single_unit.unit.originX}, 500);
            tween.onComplete.add(function() {
                if (this.game.tweens.getAll().length == 1) {
                    this.endTurn();
                }
            }, this);
            tween.start();
        }
    }, this);

    /* No survivor left */
    if (survivors == 0) {
        this.endTurn();
    }
};

PopupBattle.prototype.endTurn = function() {
    if (this.player.isAlive()) {
        if (this.enemy.isAlive()) {
            this.enableButtons();
        } else {
            this.win();
        }
    } else {
       this.lose();
    }
};

PopupBattle.prototype.disableButtons = function() {
    this.buttons.forEach(function(single_button) {
        single_button.inputEnabled = false;
    }, this);
};

PopupBattle.prototype.enableButtons = function() {
    this.buttons.forEach(function(single_button) {
        single_button.inputEnabled = true;
    }, this);
};

PopupBattle.prototype.lose = function() {
    this.buttons.forEach(function(single_button) {
        single_button.destroy();
    }, this);

    let button = this.game.add.button(0, 0, "gui:button", this.onButtonOkClicked, this, 0, 1, 0, 1);
    button.win = false;
    this.backgroundContainer.addChild(button);
    button.y = this.backgroundContainer.height - button.height - 10;
    button.x = (this.backgroundContainer.width - button.width) / 2;
    this.buttons.push(button);

    let label = this.game.add.bitmapText(0, 2, "font:normal", "Ok", 10);
    label.tint = 0xffffff;
    label.x = (button.width-label.width) / 2;
    label.y = ((button.height-label.height) / 2) - 2;
    button.addChild(label);
};

PopupBattle.prototype.win = function() {
    this.buttons.forEach(function(single_button) {
        single_button.destroy();
    }, this);

    let button = this.game.add.button(0, 0, "gui:button", this.onButtonOkClicked, this, 0, 1, 0, 1);
    button.win = true;
    this.backgroundContainer.addChild(button);
    button.y = this.backgroundContainer.height - button.height - 10;
    button.x = (this.backgroundContainer.width - button.width) / 2;
    this.buttons.push(button);

    let label = this.game.add.bitmapText(0, 2, "font:normal", "Ok", 10);
    label.tint = 0xffffff;
    label.x = (button.width-label.width) / 2;
    label.y = ((button.height-label.height) / 2) - 2;
    button.addChild(label);
};

/* Events */

PopupBattle.prototype.buttonPickClicked = function(slot, value) {
   this.hide();
};

PopupBattle.prototype.onButtonAttackClicked = function(button) {
    this.disableButtons();

    this.startAttack();
};

PopupBattle.prototype.onButtonOkClicked = function(button) {
    this.hide();
    this.onBattleCompleted.dispatch(button.win, this.tile);
};