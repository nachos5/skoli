
let canvas;
let gl;

let points = [];
let vertices = [];
let memo = {};

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    console.error('WebGL isn\'t available');
  }

  //
  //  Initialize our data for the Sierpinski Gasket
  //

  // fjórir punktar fyrir kassa með triangle strip
  /* c ---- d
     |      |
     |      |
     a ---- b */
  vertices = [
    vec2(-1, -1),
    vec2(1, -1),
    vec2(-1, 1),
    vec2(1, 1),
  ];

  const iterslider = document.getElementById('iterslider');
  const iterfjoldi = document.getElementById('iterfjoldi');
  points = divideSquare(
    vertices[0],
    vertices[1],
    vertices[2],
    vertices[3],
    iterslider.value,
  );
  iterfjoldi.innerHTML = iterslider.value;

  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers

  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Load the data into the GPU

  const bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer

  const vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  iterslider.onchange = (e) => {
    update(e.target.value);
    iterfjoldi.innerHTML = e.target.value;
  };

  render();
};

function square(a, b, c, d) {
  // points.push(a, b, c, d);
  return [a, b, c, d];
}

// einföldum flækjustigið með því að vera ekki að kalla stöðugt á push og einnig með því að nota memo json object
// til að reikna ekki sömu subproblems oft
function divideSquare(a, b, c, d, count, finish = false) {
  let p = [];
  // check for end of recursion
  if (count === 0) {
    return square(a, b, c, d);
  } else {
    // bisect the sides
    const ab = mix(a, b, 1 / 3);
    const ac = mix(a, c, 1 / 3);
    const ad = mix(a, d, 1 / 3);

    const newCount = count - 1;

    // offset
    const x = (b[0] - a[0]) / 3;

    if (!finish) {
      p = lookup(
        p,
        a, ab, ac, ad, newCount,
      ); // 1
      p = lookup(
        p,
        [a[0] + x, a[1]], [ab[0] + x, ab[1]], [ac[0] + x, ac[1]], [ad[0] + x, ad[1]], newCount,
      ); // 2
      p = lookup(
        p,
        [a[0] + 2 * x, a[1]], [ab[0] + 2 * x, ab[1]], [ac[0] + 2 * x, ac[1]], [ad[0] + 2 * x, ad[1]], newCount,
      ); // 3
      p = lookup(
        p,
        [a[0] + 2 * x, a[1] + x], [ab[0] + 2 * x, ab[1] + x], [ac[0] + 2 * x, ac[1] + x], [ad[0] + 2 * x, ad[1] + x], newCount,
      ); // 4
      p = lookup(
        p,
        [a[0] + 2 * x, a[1] + 2 * x], [ab[0] + 2 * x, ab[1] + 2 * x], [ac[0] + 2 * x, ac[1] + 2 * x], [ad[0] + 2 * x, ad[1] + 2 * x], newCount,
      ); // 5
      p = lookup(
        p,
        [a[0] + x, a[1] + 2 * x], [ab[0] + x, ab[1] + 2 * x], [ac[0] + x, ac[1] + 2 * x], [ad[0] + x, ad[1] + 2 * x], newCount,
      ); // 6
      p = lookup(
        p,
        [a[0], a[1] + 2 * x], [ab[0], ab[1] + 2 * x], [ac[0], ac[1] + 2 * x], [ad[0], ad[1] + 2 * x], newCount,
      ); // 7
      p = lookup(
        p,
        [a[0], a[1] + x], [ab[0], ab[1] + x], [ac[0], ac[1] + x], [ad[0], ad[1] + x], newCount,
      ); // 8
    }
    // undirbúum fyrir næsta
    p = lookup(p, a, ab, ac, ad, newCount, true); // 1

    return p;
  }
}

function lookupStrengur(a, b, c, d) {
  const strengur = `${a[0]},${a[1]}|${b[0]},${b[1]}|${c[0]},${c[1]}|${d[0]},${d[1]}`;
  return strengur;
}

function lookup(p, a, b, c, d, count) {
  const s = lookupStrengur(a, b, c, d);
  if (!memo[s]) {
    const subPoints = divideSquare(a, b, c, d, count);
    memo[s] = subPoints;
    return p.concat(subPoints);
  } else {
    return p.concat(memo[s]);
  }
}

function update(n) {
  console.info('updating...', n);
  points = [];
  memo = {};
  points = divideSquare(
    vertices[0],
    vertices[1],
    vertices[2],
    vertices[3],
    n,
  );
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
  render();
}

function render() {
  console.info(`Fjöldi punkta: ${points.length}`);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length);
}
