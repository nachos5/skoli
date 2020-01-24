let canvas;
let gl;
let uOffset;
let frameCounter = 0;

const numCirclePoints = 30;
const radius = 0.5;
const center = vec2(0, 0);

const points = [];

const updateInterval = 20;

// Create the points of the circle
function createCirclePoints(cent, rad, k) {
  const dAngle = (2 * Math.PI) / k;
  for (i = k; i >= 0; i -= 1) {
    a = i * dAngle;
    const p = vec2(rad * Math.sin(a) + cent[0], rad * Math.cos(a) + cent[1]);
    points.push(p);
  }
}

function update() {
  if (frameCounter === updateInterval) {
    const x = (Math.random() * 1.5) - 0.75;
    const y = (Math.random() * 1.5) - 0.75;
    const w = Math.random(); // minnkar bara
    gl.uniform4fv(uOffset, [x, y, 0, w]);
    frameCounter = 0;
  } else {
    frameCounter += 1;
  }
}

function render(frameTime) {
  // console.info(timestamp);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // uppfærum staðsetningu á updateInterval ramma fresti
  update();

  // Draw circle using Triangle Fan
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numCirclePoints + 2);

  window.requestAnimationFrame(render);
}


window.onload = () => {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    console.error('WebGL isn\'t available');
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Create the circle
  points.push(center);
  createCirclePoints(center, radius, numCirclePoints);

  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  const vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // sækjum offset uniform vigurinn til að geta hreyft hringinn um canvasinn
  uOffset = gl.getUniformLocation(program, 'uOffset');

  window.requestAnimationFrame(render);
};
