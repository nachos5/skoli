// ==========
// BALL STUFF
// ==========

// BALL STUFF

let g_ball = {
  cx: g_canvas.width / 2,
  cy: g_canvas.height / 2,
  radius: 1,

  xVel: 5,
  yVel: 4
};

g_ball.collide = true;
g_ball.timeout = true;
g_ball.color = "blue";
g_ball.everyOtherFrame = true;

g_ball.update = function(du) {
  // Remember my previous position
  let prevX = this.cx;
  let prevY = this.cy;

  // Compute my provisional new position (barring collisions)
  let nextX = prevX + this.xVel * du;
  let nextY = prevY + this.yVel * du;
  // Bounce off the paddles
  const padCol = g_paddle.collidesWith(nextX, nextY, this.radius);
  if (g_ball.collide) {
    if (padCol) {
      this.yVel *= -1;
      g_ball.collide = false;
      breakout.invuln = false;
      sound.beep('square', 400, 0, 0.25, 0.05);
    }
  }
  // we do this to prevent weird stuff, like ball getting stuck
  if (padCol && g_ball.timeout) {
    g_ball.timeout = false;
    let t = setTimeout(function() {
      g_ball.collide = true;
      g_ball.timeout = true;
      clearTimeout(t);
    }, 500)
  }

  // Bounce off the walls
  const wallCol = g_canvas.collidesWith(nextX, nextY, this.radius);
  // some beep variables
  const duration = 0.15,
    gain = 0.05;
  // vertical
  if (wallCol[1]) {
    if (this.yVel < 0) { // ball is going up
      this.yVel *= -1;
      sound.beep('square', 50, 0, duration, gain);
    }
    // if we collide with the floor we lose a life and reset the ball
    else {
      // unless we are invulnerabul!
      if (!breakout.invuln) { // we lost :(
        this.reset();
        breakout.lifes--;
        breakout.invuln = true;
        if (breakout.lifes == 0) {
          breakout.gameOver = true;
          // spooky stuff when game over
          sound.weLost();
        } else {
          // sound when we lose a life
          sound.beep('square', 20, 0, duration + 0.5, gain);
        }
      } else { // invulenarabul!
        this.yVel *= -1;
        breakout.invuln = false;
        sound.beep('square', 50, 0, duration, gain);
      }
    }
  }
  // horizontal
  if (wallCol[0]) {
    this.xVel *= -1;
    sound.beep('square', 50, 0, duration, gain);
  }

  // Bounce off bricks
  for (b in bricks) {
    if (bricks[b].alive) {
      const col = bricks[b].collidesWith(prevX, prevY, nextX, nextY, this.radius);
      // some random values for the audio beep
      const rBaseFreq = Math.random() * 1000,
        rAddFreq = Math.random() * 2000,
        rDuration = 0.1 + Math.random() * 0.15,
        rGain = 0.05 + Math.random() * 0.1;
      // vertical
      if (col[1]) {
        this.yVel *= -1;
        sound.beep('triangle', rBaseFreq, rAddFreq, rDuration, rGain);
      }
      // horizontal
      else if (col[0]) {
        this.xVel *= -1;
        sound.beep('triangle', rBaseFreq, rAddFreq, rDuration, rGain);
      }
    }
  }

  // Reset if we fall off the left or right edges
  // ...by more than some arbitrary `margin`
  //
  let margin = 4 * this.radius;
  if (nextX < -margin ||
    nextX > g_canvas.width + margin) {
    this.reset();
  }

  // color stuff
  this.color = "blue";
  if (breakout.invuln) { // flicker when we are invulnerabul
    if (g_ball.everyOtherFrame)
      this.color = "red";
  }
  g_ball.everyOtherFrame = !g_ball.everyOtherFrame;

  // ball goes faster over time!
  this.xVel *= 1.0001;
  this.yVel *= 1.0001;
  // *Actually* update my position
  // ...using whatever velocity I've ended up with
  //
  this.cx += this.xVel * du;
  this.cy += this.yVel * du;
};

g_ball.reset = function() {
  this.cx = g_canvas.width / 2,
    this.cy = g_canvas.height / 2,
    this.xVel = -5;
  this.yVel = 4;
};

g_ball.render = function(ctx) {
  ctx.save();

  ctx.fillStyle = this.color;
  fillCircle(ctx, this.cx, this.cy, this.radius + breakout.offset * 1.2);

  ctx.restore();
};
