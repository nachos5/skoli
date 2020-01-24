// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
  for (let property in descr) {
    this[property] = descr[property];
  }
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.

Paddle.prototype.halfWidth = 80;
Paddle.prototype.halfHeight = 2;
Paddle.prototype.offset = 2;

Paddle.prototype.reset = function() {
  this.cx = g_canvas.midX;
  this.cy = g_canvas.height - g_canvas.height / 10;
  this.halfWidth = 80;
}

Paddle.prototype.boost = 0;
Paddle.prototype.boostBool = false;

Paddle.prototype.update = function(du) {
  // keep track of prev position
  this.cxPrev = this.cx;
  // speedboost! be carefull though, will reduce the shrink the paddle!
  if (g_keys[this.SPEEDBOOST]) {
    this.boost = 7;
    this.boostBool = true;
    // reduce the width by 0.01%
    this.halfWidth *= 0.9995
  } else {
    this.boost = 0;
    this.boostBool = false;
  }
  // movement based on input
  if (g_keys[this.GO_LEFT]) {
    this.cx -= (5 + this.boost) * du;
  } else if (g_keys[this.GO_RIGHT]) {
    this.cx += (5 + this.boost) * du;
  }

  /* lets check if the paddle collides with either wall, if so we go back
     to our prev position */
  const cy = this.cy;
  // index 0 horizontal, 1 vertical
  const col = g_canvas.collidesWith(this.cx, cy, this.halfWidth);
  if (col[0])
    this.cx = this.cxPrev;

};

Paddle.prototype.everyOtherFrame = true;

Paddle.prototype.render = function(ctx) {
  ctx.save();

  if (this.boostBool) {
    if (this.everyOtherFrame)
      ctx.fillStyle = "orange";
  }

  ctx.fillRect(this.cx - this.halfWidth,
    this.cy - this.halfHeight,
    this.halfWidth * 2,
    this.halfHeight * 2);

  this.everyOtherFrame = !this.everyOtherFrame;

  ctx.restore();
};

Paddle.prototype.collidesWith = function(nextX, nextY, r) {
  let px = this.cx,
      py = this.cy,
      ro = r + breakout.offset;

  // x coords
  if ((nextX - ro < px + this.halfWidth) &&
      (nextX + ro > px - this.halfWidth)) {
      // y coords
      if (nextY + ro > this.cy - this.halfHeight &&
          nextY - ro < this.cy + this.halfHeight) {
          return true;
      }
    }
    return false;
};
