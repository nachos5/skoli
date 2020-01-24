// GENERIC UPDATE LOGIC

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
let NOMINAL_UPDATE_INTERVAL = 16.666;

// Dt means "delta time" and is in units of the timer-system (i.e. milliseconds)
//
let g_prevUpdateDt = null;

// Du means "delta u", where u represents time in multiples of our nominal interval
//
let g_prevUpdateDu = null;

// Track odds and evens for diagnostic / illustrative purposes
//
let g_isUpdateOdd = false;

let runOnce = true;
// bools to allow us to pause the screen for some time when a round is won
breakout.winningBool = false,
breakout.winningBoolTimeout = true;
function update(dt) {

  // Get out if skipping (e.g. due to pause-mode)
  //
  if (shouldSkipUpdate()) return;

  // lets check if we won!
  if (bricksDead()) {
    // lets enjoy the round win for 3 sec
    if (breakout.winningBoolTimeout) {
      breakout.winningBool = true;
      sound.weWon();
      g_canvas.reset();
      g_paddle.reset();
      breakout.highScoreUpdate();
      // 3 sec timeout
      let t = setTimeout(function() {
        breakout.winningBool = false;
        clearTimeout(t);
      }, 3000)
      breakout.winningBoolTimeout = false;
    }
    // we draw some text for these 3 sec
    if (breakout.winningBool)
      return;
    breakout.lifes = 3;
    g_ball.reset();
    breakout.newBricks();
    breakout.winningBoolTimeout = true;
    return;
  }

  // lets check if we lost
  if (breakout.gameOver) {
    if (runOnce) {
      g_canvas.reset();
      g_paddle.reset();
      g_ball.reset();
      breakout.newBricks();
      breakout.currStage = 0;
      runOnce = false;
    }
    // 5 sec timeout'
    let t = setTimeout(function() {
      breakout.gameOver = false;
      breakout.lifes = 3;
      runOnce = true;
      clearTimeout(t);
    }, 5000)
    return;
  }

  // Remember this for later
  //
  let original_dt = dt;

  // Warn about very large dt values -- they may lead to error
  //
  if (dt > 200) {
    console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
    dt = NOMINAL_UPDATE_INTERVAL;
  }

  // If using letiable time, divide the actual delta by the "nominal" rate,
  // giving us a conveniently scaled "du" to work with.
  //
  let du = (dt / NOMINAL_UPDATE_INTERVAL);
  // the further the player gets, the faster everything goes!
  const extraSpeed = breakout.currStage / 4;
  updateSimulation(du + extraSpeed);

  g_prevUpdateDt = original_dt;
  g_prevUpdateDu = du;

  g_isUpdateOdd = !g_isUpdateOdd;
}

// Togglable Pause Mode
//
let KEY_PAUSE = 'P'.charCodeAt(0),
    KEY_STEP = 'O'.charCodeAt(0);

let g_isUpdatePaused = false;

function shouldSkipUpdate() {
  if (eatKey(KEY_PAUSE)) {
    g_isUpdatePaused = !g_isUpdatePaused;
  }
  return g_isUpdatePaused && !eatKey(KEY_STEP);
}

// function to check if all the bricks are "dead", then we win!
function bricksDead() {
  if (bricks.length == 0)
    return false;
  for (b in bricks) {
    if (bricks[b].alive)
      return false;
  }
  return true;
}
