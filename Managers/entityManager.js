/*

We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_bullets : [],
_ships   : [],
_enemies : [],
_caterpillars: [],
_bulletPowerups: [],
_shipPowerups: [],
_landMines: [],
_lightnings: [],
_points: [],

// "PRIVATE" METHODS


_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [ this._bullets, this._ships, this._enemies, this._landMines, this._bulletPowerups, this._shipPowerups, this._lightnings, this._points];
},

init: function() {
    this._enemies.push(new SideEnemy({cx: 0, cy: 200}));
    this._enemies.push(new UpEnemy({cx: 200, cy: 0}));

},

resetCategories: function() {
    for (var c = 0; c < this._categories.length; ++c) {
        var cat = this._categories[c];
        while(cat.length){
            var entity = cat.pop();
        }
    }
},

sendKamikaze: function(){
	this._enemies.push(new Kamikaze({
        cx: (g_canvas.width / 10) + Math.random() * (g_canvas.width - g_canvas.width / 5), 
        cy: 0,
		targetY: (g_canvas.height / 10) + Math.random() * (g_canvas.height / 2 - g_canvas.height / 5),
		killBulletPowerup: false
	}));
},

createCaterpillar: function(id){
    // Randoms starting Y position of catapillar in the upper 1-10 grid
    var posY = ( g_canvas.height / 30 ) + Math.random() * ( g_canvas.width/30 * 9 ); 
    // Random how long right and left the caterpillar goes
    var randomRight = g_canvas.width/2 + Math.random() * ( g_canvas.width/2 );
    var randomLeft = Math.random()*(g_canvas.width/2);
    var positionNum = 0;
    // Worm length from 3-10
    var wormLength = 3 + Math.round( Math.random() * 7 )
    for( var i = 0 ; i < wormLength ; i++ ) {   
        setTimeout(function () {
            this._enemies.push(new Caterpillar({
            cx: 0, 
            cy: posY,
            startY: posY,
            velY: 0.5,                // For moving up and down in a worm way
            velX: 4,
            id: id,
            wormLength: wormLength,
            direction: true,          // If true he is going right, if false he is going left
            randomRight: randomRight, // What distance it goes right 
            randomLeft: randomLeft,   // What distance it goes left
            position: positionNum,    // Number of caterpillar peace
            killBulletPowerup:false
        }));
        positionNum++;
        }.bind(this, positionNum), i * 1800 / NOMINAL_UPDATE_INTERVAL);
    }
},
createBulletPowerup: function(cx,cy){
    this._bulletPowerups.push(new BulletPowerup({
        cx: cx, 
        cy: cy
    }));
},
createShipPowerup: function(cx,cy){
    this._bulletPowerups.push(new ShipPowerup({
        cx: cx, 
        cy: cy
    }));
},
fireBullet: function(cx, cy, velX, velY, rotation, killShip) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        killShip: killShip,
        rotation : rotation,
        timestamp : main.getCurrTime()
    }));
},

fireball: function(cx, cy, velX, velY) {
	this._enemies.push(new Fireball({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY
    }));
},

generateShip : function(killBulletPowerup, killShipPowerup) {
    this._ships.push(new Ship({
        cx: 200,
        cy: 200,
        killBulletPowerup : killBulletPowerup,
        killShipPowerup : killShipPowerup
    }));
},

fireLightning : function(cx, cy) {
    this._lightnings.push(new Lightning({
        cx: cx,
        cy: cy,
        killShip: true,
        isLightning: true
    }));
},

createLandMine : function(cx, cy) {
    this._landMines.push(new LandMine({
        cx: cx,
        cy: cy,
        killShip: true
    }));
},

makePointsAppear : function(cx, cy, amount) {
    this._points.push(new Points({
        cx: cx,
        cy: cy,
        amount: amount
    }));
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

