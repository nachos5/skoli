let canvas;
let gl;

const lengdFraMidju = 0.05;
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
    const leftClick = e.button === 0;
    const rightClick = e.button === 2;

    if (leftClick) {
      // Reikna heimshnit músarinnar út frá skjáhnitum
      // frá -1 til 1
      const mouseX = ((2 * e.offsetX) / canvas.width) - 1;
      const mouseY = ((2 * (canvas.height - e.offsetY)) / canvas.height) - 1;
      const center = vec2(mouseX, mouseY);
      // hnit þríhyrningsins
      // 30 gráður
      const x = rotateVector(vec2(mouseX - lengdFraMidju, mouseY), center, Math.PI / 6);
      // -30 gráður
      const y = rotateVector(vec2(mouseX + lengdFraMidju, mouseY), center, -(Math.PI / 6));
      const z = vec2(mouseX, mouseY + lengdFraMidju);
      console.info(`x: ${x}, y: ${y}, z: ${z}`);

      // Færa þessi hnit yfir í grafíkminni, á réttan stað
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(x));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(y));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(z));

      index += 3;
    }

    // hreinsum við hægri smell
    if (rightClick) {
      index = 0;
    }
  });

  render();
};

// tekur við 2D vigri og radíönum og skilar rotate-aða vigrinum
function rotateVector(vec, center, rotation) {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  // translate-um
  const xTranslate = vec[0] - center[0];
  const yTranslate = vec[1] - center[1];
  let xNew = xTranslate * cos - yTranslate * sin;
  let yNew = xTranslate * sin + yTranslate * cos;
  // translate-um til baka
  xNew += center[0];
  yNew += center[1];
  return vec2(xNew, yNew);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, index);

  window.requestAnimFrame(render);
}
