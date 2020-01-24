
let gl;
let points;
let vertices;

window.onload = function init() {
  const canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    console.error('WebGL isn\'t available');
  }

  //  Initialize our data for the Sierpinski Gasket

  // First, initialize the corners of our gasket with three points.

  vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1),
  ];

  const slider = document.getElementById('punktaslider');
  const numPointsInit = slider.value;
  computePoints(null, numPointsInit);
  slider.onchange = computePoints;

  //  Configure WebGL

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

  render();
};

// Compute new points
// Each new point is located midway between
// last point and a randomly chosen vertex
function computePoints(e = null, numPoints = null) {
  const n = e ? e.target.value : numPoints;
  console.info(`computing ${n} points...`);

  // Specify a starting point p for our iterations
  // p must lie inside any set of three vertices

  const u = add(vertices[0], vertices[1]);
  const v = add(vertices[0], vertices[2]);
  let p = scale(0.25, add(u, v));

  // And, add our initial point into our array of points

  points = [p];

  for (let i = 0; points.length < n; i++) {
    const j = Math.floor(Math.random() * 3);
    p = add(points[i], vertices[j]);
    p = scale(0.5, p);
    points.push(p);
  }

  if (e) {
    update();
    render();
  }

  // birtum hjá slidernum hversu marga punkta er verið að rendera
  document.getElementById('punktafjoldi').innerHTML = n;
}

function update() {
  console.info('updating...');
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
}

function render() {
  console.info('rendering...');
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, points.length);
}
