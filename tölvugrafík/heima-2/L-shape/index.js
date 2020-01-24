let gl;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
}

window.onload = () => {
  const canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) {
    console.error('WebGL isn\'t available');
  }

  /*
  mynd til að lýsa hnitunum:
  2-----1
  |     |
  |     |
  |     3-----5
  |           |
  4-----------6
  */
  const vertices = new Float32Array(
    [
      0, 0.5, // 1
      -0.5, 0.5, // 2
      0, 0, // 3
      -0.5, -0.5, // 4
      0.5, 0, // 5
      0.5, -0.5, // 6
    ],
  );

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Load the data into the GPU
  const bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  const vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
};
