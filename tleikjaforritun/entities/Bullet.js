// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Initial, inheritable, default values
//
// (You might want these to assist with early testing,
//  even though they are unnecessary in the "real" code.)
//
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;

// Convert times from seconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3 * SECS_TO_NOMINALS;

Bullet.prototype.update = function (du) {

    // TODO: Implement this

    // NB: Remember to handle screen-wrapping... and "death"

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    // screen wrapping
    this.wrapPosition();
    // reduce "hp" every frame
    this.lifeSpan--;
};

Bullet.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
}

Bullet.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
}

Bullet.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Bullet.prototype.render = function (ctx) {
    ctx.save();

    // TODO: Modify this to implement a smooth "fade-out" during
    // the last third of the bullet's total "lifeSpan"

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    // below third of its life
    if (this.lifeSpan <= fadeThresh) {
      // lets get ratio value between 0 and 1
      const ratio = this.lifeSpan / fadeThresh
      // lets apply that value to our global alpha
      ctx.globalAlpha = ratio;
    }

    // just in case
    if (this.lifeSpan < 0)
      ctx.globalAlpha = 0;

    // drawing!
    g_sprites.bullet.drawWrappedCentredAt(
	     ctx, this.cx, this.cy, this.rotation
    );

    ctx.restore();
};
