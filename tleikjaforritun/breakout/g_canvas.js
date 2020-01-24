/**
 *** crazy canvas stuff, moving it, shrinking it etc.
 **/

// some neat stuff
let properties = {
  midX : g_canvas.width / 2,
  midY : g_canvas.height / 2,
  ///// resizing stuff //////
  // how wide the field can get
  // general max and min
  max : g_canvas.width,
  min : g_canvas.width / 2,
  // current max and min (for dynamics)
  currMax : g_canvas.width,
  currMin : g_canvas.width / 2 + Math.random() * (g_canvas.width / 2),
  resBool : true, // to check when we should resize / shrink the field
  // how high the field can get
  maxH : g_canvas.height,
  minH : g_canvas.height / 2,
  currMaxH : g_canvas.height,
  currMinH : g_canvas.height / 2 + Math.random()* (g_canvas.height / 2),
  resBoolH : true, // to check when we should resize / shrink the field
  // positioning stuff (through css)
  maxPos : 200,
  minPos : 0,
  // same applies here, current max and min for dynamics
  currMaxPos : 100 + Math.random() * 100,
  currMinPos : 0,
  posBool : true
}
// lets append these properties to the canvas object
for (p in properties) g_canvas[p] = properties[p];

g_canvas.reset = function() {
  this.width = this.max;
  this.height = this.maxH;
  this.style.top = 10;
  this.style.left = 10;
}

// lets update the madness!
g_canvas.update = function(du) {
  // prev stuff
  const prevW = this.width,
        prevH = this.height;
  // dynamic colors (we shift each color)
  for (let x in this.col_vars) {
    this.col_vars[x] += Math.random()*20;
    if (this.col_vars[x] > 255)
      this.col_vars[x] = 0;
  }

  // resizing + canvas positioning madness! Speed is based on our du value
  this.resizeCanvas(du);
  this.canvasPosition(du);
  // want to push the paddle to the left if it is against the wall
  this.delta = prevW - this.width;
  const pad_col = this.width <= g_paddle.cx + g_paddle.halfWidth;
  if (pad_col) g_paddle.cx -= this.delta + breakout.offset;
}


// resizing the canvas!
g_canvas.resizeCanvas = function(du) {
  du = parseInt(du);
  // width:
  if (this.currMin < this.currMax && this.resBool) { // shrinking the field!
    this.width -= du;
    // when we reach the minimum we enlarge the field
    if (this.width < this.currMin) {
      this.resBool = false;
    }
  } else { // enlarging the field!
    this.width += du;
    // when we reach the max we shrink again
    if (this.width > this.currMax) {
      // we create new random current values within the range of max / min
      this.currMin = this.min + Math.random() * (this.max - this.min);
      this.currMax = this.currMin + Math.random() * (this.max - this.currMin);
      this.resBool = true; // we shrink again
    }

    // height:
  }
  if (this.currMinH < this.currMaxH && this.resBoolH) { // shrinking the field!
    this.height -= du;
    g_paddle.cy -= du;
    // when we reach the mininum we enlarge the field
    if (this.height < this.currMinH) {
      this.resBoolH = false;
    }
  } else { // enlarging the field!
    this.height += du;
    g_paddle.cy += du;
    // when we reach the max we shrink again
    if (this.height > this.currMaxH) {
      this.currMinH = this.minH + Math.random() * (this.maxH - this.minH);
      this.currMaxH = this.currMinH + Math.random() * (this.maxH - this.currMinH);
      this.resBoolH = true;
    }
  }
}

// function to mess with the canvas position by css
g_canvas.canvasPosition = function(du) {
  // lets get the left property of our absolute positioned canvas
  let leftPos = parseInt(this.style.left);
  // move the canvas to the right
  if (leftPos < this.currMaxPos && this.posBool) {
    leftPos++;
    // when we reach the max we move it left
    if (leftPos > this.currMaxPos) {
      this.currMaxPos = 100 + Math.random() * (this.maxPos - 100);
      this.posBool = false;
    }
  }
  // move the canvas to the left
  else {
    leftPos--;
    // when we reach the min we move it right
    if (leftPos < this.currMinPos) {
      this.currMinPos = Math.random() * this.currMaxPos;
      this.posBool = true;
    }
  }
  // apply the style
  this.style.left = leftPos.toString();
  // lets also mess with the top position
  this.style.top = (leftPos / 2).toString();
}

// function for checking collisions
g_canvas.collidesWith = function(nextX, nextY, r) {
  const cw = this.width,
        ch = this.height;
  // bools for vertical and horizontal collisions
  let col_hor = false,
      col_ver = false;
  // some "breathing room"
  ro = r + breakout.offset;
  // left and right wall
  if ((nextX - ro <= 0) ||
    (nextX + ro >= cw))
      col_hor = true;

  // top and bottom
  if ((nextY - ro <= 0) ||
    (nextY + ro >= ch))
      col_ver = true;

  return [col_hor, col_ver];
}
