function PopupBattle(game) {
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

    this.createMap();

    this.setTurns(1);

    this.player = new Unit(this.game, 'knight');
    this.player.x = this.map.getChildAt(11).x;
    this.player.face(Unit.Facing.Right);
    this.player.y = this.map.getChildAt(11).y;
    this.player.setHealth(GAME.player.health);
    this.map.addChild(this.player);

    this.player.bar = new Bar(this.game, GAME.player.health, GAME.player.max_health);
    this.player.bar.x = this.player.x;
    this.player.bar.y = this.player.y - 50;
    this.map.addChild(this.player.bar);

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

PopupBattle.prototype.createMap = function() {
    console.log('CREATE MAP');
    this.map = this.game.add.group();

    for (let y=0; y<5; y++) {
        for (let x=0; x<5; x++) {
            let tile = new Tile(this.game, x, y);
            this.map.addChild(tile);
        }
    }

    this.map.x = (this.backgroundContainer.width - this.map.width) / 2;
    this.map.y = this.map.x;
    this.backgroundContainer.addChild(this.map);
};

PopupBattle.prototype.setTurns = function(turns) {
    this.turns = turns;
};

PopupBattle.prototype.setEnemy = function(enemy) {
    this.tile = enemy.grid;
    
    this.enemy = new Unit(this.game, enemy.unitID);
    this.enemy.setHealth(enemy.health);
    this.enemy.x = this.map.getChildAt(13).x;
    this.enemy.y = this.map.getChildAt(13).y;
    this.map.addChild(this.enemy);

    this.enemy.bar = new Bar(this.game, enemy.health, enemy.health);
    this.enemy.bar.x = this.enemy.x;
    this.enemy.bar.y = this.enemy.y - 50;
    this.map.addChild(this.enemy.bar);
};

PopupBattle.prototype.startAttack = function() {
    let units = [{
        unit:this.player,
        direction: 1
    },{
        unit:this.enemy,
        direction: -1
    }];

    let middle = ((this.enemy.x - this.player.x) / 2) - (this.player.width * .25);

    let attackers = 2;
    units.forEach(function(single_unit) {
        single_unit.unit.damage = this.game.rnd.integerInRange(1, 6);

        single_unit.unit.originX = single_unit.unit.x;

        let tween = this.game.add.tween(single_unit.unit).to({x:single_unit.unit.x+(middle * single_unit.direction)}, 100, Phaser.Easing.Quadratic.In);
        tween.onComplete.add(function() {
            attackers--;
            if (attackers <= 0) {
                this.generateAttack();
            }
        }, this);
        tween.start();
    }, this);
};

PopupBattle.prototype.generateAttack = function() {
    this.showDamage(this.player, this.enemy.damage);

    this.showDamage(this.enemy, this.player.damage);

    let effect = new Effect(this.game, this.player.x + (this.player.width/2), this.player.y, "attack");
    this.backgroundContainer.addChild(effect);
    effect.onEffectComplete.add(function() {
        this.player.takeDamage(this.enemy.damage);
        this.player.bar.move(this.player.health);
        GAME.player.health = this.player.health;
        
        this.enemy.takeDamage(this.player.damage);
        this.enemy.bar.move(this.enemy.health);
        this.endAttack();
    }, this);
};

PopupBattle.prototype.showDamage = function(unit, damage) {
    let label = this.game.add.bitmapText(0, 2, "font:outline", damage, 20);
    label.x = unit.x + (label.width/2);// + (unit.width/2);
    label.y = (unit.y - (unit.height/2));

    let tween = this.game.add.tween(label).to({y:label.y - 50}, 1000);
    tween.onComplete.add(function() {
        label.destroy();
    }, this);
    tween.start();

    this.game.add.tween(label).to({alpha:0}, 800).start();

    this.backgroundContainer.addChild(label);
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
            let tween = this.game.add.tween(single_unit.unit).to({x:single_unit.unit.originX}, 100, Phaser.Easing.Quadratic.Out);
            tween.onComplete.add(function() {
                survivors--;
                if (survivors <= 0) {
                    this.endTurn();
                }
            }, this);
            tween.start();
        } else {
            /* If the unit is dead, make the bar disapear */
            this.game.add.tween(single_unit.unit.bar).to({alpha:0}, 200).start();
        }
    }, this);
    /* No survivor left */
    if (survivors == 0) {
        this.endTurn();
    }
};

PopupBattle.prototype.endTurn = function() {
    this.turns--;

    if (this.player.isAlive()) {
        if (this.enemy.isAlive()) {
            if (this.turns > 0) {
                this.enableButtons();
            } else {
                this.draw();
            }
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
    button.status = 'lose';
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
    button.status = 'win';
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

PopupBattle.prototype.draw = function() {
    this.buttons.forEach(function(single_button) {
        single_button.destroy();
    }, this);

    let button = this.game.add.button(0, 0, "gui:button", this.onButtonOkClicked, this, 0, 1, 0, 1);
    button.status = 'draw';
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
    this.onBattleCompleted.dispatch(button.status, {enemy:this.enemy, tile:this.tile, turns:this.turns});
};