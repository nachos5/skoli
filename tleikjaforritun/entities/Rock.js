// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Rock() {

    // TODO: Implement this

    // NB: Set our `cx` and `cy` values to random positions on the canvas
    //     `g_canvas`, and its properties, are available to you here.

    // Rock randomisation
    const rw = g_canvas.width * Math.random(),
          rh = g_canvas.height * Math.random();
    this.cx = rw;
    this.cy = rh;
    this.rotation = 0;

    var MIN_SPEED = 20,
        MAX_SPEED = 70;

    // Set the velocity so that the rock has a random direction,
    // and a speed between the MIN and MAX as defined above.
    //
    // The SPEED vals are expressed in pixels per SECOND.
    // ...but `du` will be in "nominals", of course...
    // ...use SECS_TO_NOMINALS (from "globals.js") to convert.
    //
    // Yes, this needs a bit of Math.
    // Also, the `util` module can help you.
    //
    // Some helper vars (e.g. `speed` and `dirn` might be good to have)
    //

    // random speed (per nominal)
    let randSpeed = util.randRange(MIN_SPEED / SECS_TO_NOMINALS,
                                   MAX_SPEED / SECS_TO_NOMINALS);
    // random direction constant
    const rDir = 2 * Math.PI * Math.random();
    // speed
    this.velX = randSpeed * Math.cos(rDir);
    this.velY = randSpeed * Math.sin(rDir);
    // random directions
    if (Math.random() < 0.5) this.velX *= -1;
    if (Math.random() < 0.5) this.velY *= -1;


    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    // random rotation speed (per nominal)
    let randRot = util.randRange(MIN_ROT_SPEED / SECS_TO_NOMINALS,
                                 MAX_ROT_SPEED / SECS_TO_NOMINALS);
    this.velRot = randRot;

}

Rock.prototype.update = function (du) {
    // I DID THIS BIT FOR YOU. NICE, AREN'T I?

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += this.velRot * du;
    this.rotation = util.wrapRange(this.rotation,
				   0, consts.FULL_CIRCLE);

    this.wrapPosition();
};

Rock.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
}

Rock.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
}

Rock.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Rock.prototype.render = function (ctx) {

    g_sprites.rock.drawWrappedCentredAt(
	     ctx, this.cx, this.cy, this.rotation
    );

};
