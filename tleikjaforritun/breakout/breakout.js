// "Crappy PONG" -- step by step
//
// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/
/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ============
// PADDLE STUFF
// ============

let KEY_A = 'A'.charCodeAt(0);
let KEY_D = 'D'.charCodeAt(0);
let KEY_SPACE = ' '.charCodeAt(0);

let g_paddle = new Paddle({
  cx: g_canvas.midX,
  cy: g_canvas.height - g_canvas.height / 10,

  GO_LEFT: KEY_A,
  GO_RIGHT: KEY_D,
  SPEEDBOOST: KEY_SPACE
});

// ============
// BRICK STUFF
// ============

// an array to store our bricks
let bricks = [];
breakout.newBricks = function () {
  bricks = [];
  const brickCount = 10,
        brickRows = 5;
  // a random number for the potential of skipping a brick, the further
  // the player gets, less bricks are skipped
  let c = breakout.currStage + 1;
  if (breakout.currStage == undefined) c = 1;
  if (c > 1) c *= 0.75;
  let rand = Math.random() * (1/c);
  // lets construct some bricks!
  for (let j=1; j<brickRows; j++) {
    for (let i=1; i<brickCount; i++) {
      if (rand <= 0.4) {
        const b = new Brick({
          cx: g_canvas.width * i/brickCount,
          cy: (g_canvas.height / 10) * j,
          halfWidth: g_canvas.width * 0.03,
          halfHeight: g_canvas.height * 0.01,
          alive: true,
          index: i/brickCount,
          indexRow: j
        });
        bricks.push(b);
      }
      rand = Math.random() * (1/c);
    }
  }
}
breakout.newBricks();

// ============
// WINNING RENDER
// ============
breakout.winningRender = function(ctx) {
  ctx.save();
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Wow good job! Get ready for the next round...", g_canvas.midX, g_canvas.midY);
  ctx.restore();
}


// ============
// HIGH SCORE
// ============
// all time high score
if (localStorage.getItem("HighScore"))
  breakout.highScore = localStorage.getItem("HighScore");
else breakout.highScore = 0;
// current high score
breakout.currHighScore = 0;
// current stage
breakout.currStage = 0;

// lets increment our score counter
breakout.highScoreUpdate = function() {
  breakout.currStage++;
  // update current high score
  if (breakout.currStage > breakout.currHighScore)
    breakout.currHighScore = breakout.currStage;
  // update all time high score
  if (breakout.currHighScore > breakout.highScore) {
    breakout.highScore = breakout.currHighScore
    localStorage.setItem("HighScore", breakout.highScore)
  }
}

breakout.highScoreRender = function(ctx) {
  ctx.save();
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.fillText("Current Stage: " + breakout.currStage,
                g_canvas.width - 10, g_canvas.height - 10);
  ctx.fillText("Current High Score: " + breakout.currHighScore,
                g_canvas.width - 10, g_canvas.height - 25);
  ctx.fillText("High Score: " + breakout.highScore,
                g_canvas.width - 10, g_canvas.height - 40);
  ctx.restore();
}

// =============
// SPRITE AND LIFE STUFF
// =============
breakout.heart = new Sprite("https://notendur.hi.is/gon2/tleikjaforritun/breakout/hjarta.png",
                            30, 30);
breakout.heartRender = function(ctx) {
  if (breakout.lifes == 0) return;
  breakout.heart.drawCentredAt(ctx, g_canvas.width/2, g_canvas.height - breakout.heart.height);
  if (breakout.lifes == 1) return;
  breakout.heart.drawCentredAt(ctx, g_canvas.width/2 - 40, g_canvas.height - breakout.heart.height);
  if (breakout.lifes == 2) return;
  breakout.heart.drawCentredAt(ctx, g_canvas.width/2 + 40, g_canvas.height - breakout.heart.height);
}
// invulnerability
breakout.invuln = true;
// lifes
breakout.lifes = 3;
breakout.gameOver = false;

breakout.gameOverRender = function(ctx) {
  ctx.save();
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("You lost :) A new game will start in a few moments", g_canvas.midX, g_canvas.midY);
  ctx.restore();
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
  // Nothing to do here!
  // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    g_canvas.update(du);
    const its = 5,
          speed = 1;
    for (let i=0; i<its; i++) {
      g_paddle.update(du/its*speed);
      for (b in bricks) {
        bricks[b].update(du/its*speed);
      }
      g_ball.update(du/its*speed);
    }
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
  if (!breakout.gameOver) {
    g_ball.render(ctx);
    g_paddle.render(ctx);
    for (b in bricks) {
      bricks[b].render(ctx);
    }
  }
  breakout.highScoreRender(ctx);
  breakout.heartRender(ctx);
}

// Kick it off
g_main.init();
