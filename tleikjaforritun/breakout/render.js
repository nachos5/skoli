// GENERIC RENDERING

let g_doClear = true;
let g_doBox = false;
let g_undoBox = false;
let g_doFlipFlop = false;
let g_doRender = true;

let g_frameCounter = 1;

let TOGGLE_CLEAR = 'C'.charCodeAt(0);
let TOGGLE_BOX = 'B'.charCodeAt(0);
let TOGGLE_UNDO_BOX = 'U'.charCodeAt(0);
let TOGGLE_FLIPFLOP = 'F'.charCodeAt(0);
let TOGGLE_RENDER = 'R'.charCodeAt(0);

function render(ctx) {

  // Process letious option toggles
  //
  if (eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;
  if (eatKey(TOGGLE_BOX)) g_doBox = !g_doBox;
  if (eatKey(TOGGLE_UNDO_BOX)) g_undoBox = !g_undoBox;
  if (eatKey(TOGGLE_FLIPFLOP)) g_doFlipFlop = !g_doFlipFlop;
  if (eatKey(TOGGLE_RENDER)) g_doRender = !g_doRender;

  // I've pulled the clear out of `renderSimulation()` and into
  // here, so that it becomes part of our "diagnostic" wrappers
  //
  if (g_doClear) clearCanvas(ctx);

  // The main purpose of the box is to demonstrate that it is
  // always deleted by the subsequent "undo" before you get to
  // see it...
  //
  // i.e. double-buffering prevents flicker!
  //
  if (g_doBox) fillBox(ctx, 200, 200, 50, 50, "red");


  // The core rendering of the actual game / simulation
  //
  if (g_doRender) renderSimulation(ctx);
  // when a round is won we draw some text for 3 sec, wow!
  if (breakout.winningBool) breakout.winningRender(ctx);
  // if we lost we will render some text for 5 sec
  if (breakout.gameOver) breakout.gameOverRender(ctx);


  // This flip-flip mechanism illustrates the pattern of alternation
  // between frames, which provides a crude illustration of whether
  // we are running "in sync" with the display refresh rate.
  //
  // e.g. in pathological cases, we might only see the "even" frames.
  //
  if (g_doFlipFlop) {
    let boxX = 250,
      boxY = g_isUpdateOdd ? 100 : 200;

    // Draw flip-flop box
    fillBox(ctx, boxX, boxY, 50, 50, "green");

    // Display the current frame-counter in the box...
    ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
    // ..and its odd/even status too
    let text = g_frameCounter % 2 ? "odd" : "even";
    ctx.fillText(text, boxX + 10, boxY + 40);
  }

  // Optional erasure of diagnostic "box",
  // to illustrate flicker-proof double-buffering
  //
  if (g_undoBox) ctx.clearRect(200, 200, 50, 50);

  ++g_frameCounter;
}
