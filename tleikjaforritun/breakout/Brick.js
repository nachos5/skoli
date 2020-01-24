// A generic constructor which accepts an arbitrary descriptor object
function Brick(descr) {
  for (let property in descr) {
    this[property] = descr[property];
  }
}

Brick.prototype.color = "black";

Brick.prototype.update = function(du) {
  this.cx = g_canvas.width * this.index;
  this.cy = (g_canvas.height / 10) * this.indexRow;
  this.halfWidth = g_canvas.width * 0.03;
  this.halfHeight = g_canvas.height * 0.015;
  // color stuff
  const cArr = this.randColor();
  this.color = "rgb(" + cArr[0] + "," + cArr[1] + "," + cArr[2] + ")";
}

Brick.prototype.render = function(ctx) {
  ctx.save();
  ctx.fillStyle = this.color;
  if (this.alive) {
    ctx.fillRect(this.cx - this.halfWidth,
      this.cy - this.halfHeight,
      this.halfWidth * 2,
      this.halfHeight * 2);
  }
  ctx.restore();
}

Brick.prototype.randColor = function() {
  let arr = [];
  // lets append 9 variables to the array
  for (let i=0; i<3; i++) {
    arr[i] = Math.random() * 255;
  }
  return arr;
}

// function for checking collisions
Brick.prototype.collidesWith = function(prevX, prevY, nextX, nextY, r) {
  // bools for vertical and horizontal collisions
  let col_hor = false,
      col_ver = false;
  // some "breathing room"
  ro = r + breakout.offset + 3;

  // horizontal collision
  // x
  if ((nextX - ro < this.cx + this.halfWidth && prevX - r >= this.cx + this.halfWidth && g_ball.xVel < 0) ||
      (nextX + ro > this.cx - this.halfWidth && prevX + r <= this.cx - this.halfWidth && g_ball.xVel > 0)) {
    // y
    if (nextY + ro >= this.cy - this.halfHeight &&
        nextY - ro <= this.cy + this.halfHeight) {
          col_hor = true;
          this.alive = false;
    }
  }

  // vertical collision
  // y
  if ((nextY - ro < this.cy + this.halfHeight && prevY - r >= this.cy + this.halfHeight && g_ball.yVel < 0) ||
      (nextY + ro > this.cy - this.halfHeight && prevY + r <= this.cy - this.halfHeight && g_ball.yVel > 0)) {
    // x
    if (nextX - ro >= this.cx - this.halfWidth &&
        nextX + ro <= this.cx + this.halfWidth) {
          col_ver = true;
          this.alive = false;
    }
  }

  return [col_hor, col_ver];
}
