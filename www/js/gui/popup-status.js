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
    
};