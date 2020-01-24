/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


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

  _rocks: [],
  _bullets: [],
  _ships: [],

  _bShowRocks: false,

  // "PRIVATE" METHODS

  _generateRocks: function() {
    let NUM_ROCKS = 4;

    // lets make 'NUM_ROCKS' of rocks!
    for (let i = 0; i < NUM_ROCKS; i++) {
      const rock = new Rock();
      this._rocks.push(rock);
    }
  },

  _findNearestShip: function(posX, posY) {

    // TODO: Implement this
    let dist = Number.MAX_SAFE_INTEGER,
        closestShip = undefined,
        closestIndex = undefined;

    // lets iterate over the ship and find the nearest (wrapped) ship
    for (let ship in this._ships) {
      let shipX = this._ships[ship].cx,
          shipY = this._ships[ship].cy;
      let currDist = util.wrappedDistSq(posX, posY, shipX, shipY,
                                        g_canvas.width, g_canvas.height);
      if (currDist < dist) {
        dist = currDist;
        closestShip = this._ships[ship];
        closestIndex = this._ships.indexOf(this._ships[ship]);
      }
    }

    return {
      theShip : closestShip, // the object itself
      theIndex : closestIndex // the array index where it lives
    };
  },

  _forEachOf: function(aCategory, fn, arg) {
    for (var i = 0; i < aCategory.length; ++i) {
      if (arg == undefined)
        fn.call(aCategory[i]);
      else
        fn.call(aCategory[i], arg)
    }
  },

  // PUBLIC METHODS

  // A special return value, used by other objects,
  // to request the blessed release of death!
  //
  KILL_ME_NOW: -1,

  // Some things must be deferred until after initial construction
  // i.e. thing which need `this` to be defined.
  //
  deferredSetup: function() {
    this._categories = [this._rocks, this._bullets, this._ships];
  },

  init: function() {
    this._generateRocks();

    // I could have made some ships here too, but decided not to.
    //this._generateShip();
  },

  fireBullet: function(cx, cy, velX, velY, rotation) {

    let descr = {
      cx: cx,
      cy: cy,
      velX: velX,
      velY: velY,
      rotation: rotation
    }

    const b = new Bullet(descr);
    this._bullets.push(b);
  },

  generateShip: function(descr) {
    // TODO: Implement this
    const ship = new Ship(descr);
    this._ships.push(ship);
  },

  killNearestShip: function(xPos, yPos) {
    // TODO: Implement this
    // lets get the nearest ship
    const shipInd = this._findNearestShip(xPos, yPos).theIndex;
    // and delete it (using splice)
    this._ships.splice(shipInd, 1);
    // NB: Don't forget the "edge cases"
  },

  yoinkNearestShip: function(xPos, yPos) {
    // TODO: Implement this
    // lets get the nearest ship
    const ship = this._findNearestShip(xPos, yPos).theShip;
    // and move its position
    ship.setPos(xPos, yPos);
    // NB: Don't forget the "edge cases"
  },

  resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
  },

  haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
  },

  toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
  },

  update: function(du) {
    // rocks
    this._forEachOf(this._rocks, Rock.prototype.update, du);
    // ships
    this._forEachOf(this._ships, Ship.prototype.update, du);
    // bullets, updating and killing them
    for (let b in this._bullets) {
      const bullet = this._bullets[b];
      bullet.update(du);
        // we don't want to store dead objects in our bullets array
      if (bullet.lifeSpan <= 0) {
        const ind = this._bullets.indexOf(bullet);
        this._bullets.splice(ind, 1);
      }
    }

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.
  },

  render: function(ctx) {
    // rocks
    if (this._bShowRocks)
      this._forEachOf(this._rocks, Rock.prototype.render, ctx);
    // ships
    this._forEachOf(this._ships, Ship.prototype.render, ctx);
    // bullets
    for (let b in this._bullets)
      this._bullets[b].render(ctx);
  }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
