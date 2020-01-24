let canvas;
let gl;


const maxNumPoints = 200;
let index = 0;

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    console.error('WebGL isn\'t available');
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 1.0, 1.0);

  //
  //  Load shaders and initialize attribute buffers
  //
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);


  // Tökum frá minnispláss í grafíkminni fyrir maxNumPoints tvívíð hnit (float er 4 bæti)
  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumPoints, gl.DYNAMIC_DRAW);

  const vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Meðhöndlun á músarsmellum
  canvas.addEventListener('mousedown', (e) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    // Reikna heimshnit músarinnar út frá skjáhnitum
    console.info(`offsetX: ${e.offsetX}, offsetY: ${e.offsetY}`);
    console.info(`canvas w: ${canvas.width}, canvas h: ${canvas.height}`);
    // const t = vec2(
    //   ((2 * e.offsetX) / canvas.width) - 1,
    //   ((2 * (canvas.height - e.offsetY)) / canvas.height) - 1,
    // );
    const t = vec2(e.offsetX, e.offsetY);

    // Færa þessi hnit yfir í grafíkminni, á réttan stað
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

    index++;
  });

  render();
};


function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, index);

  window.requestAnimFrame(render);
}
