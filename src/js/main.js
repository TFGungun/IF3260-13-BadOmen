var canvas = document.getElementById("webgl-app");
canvas.width = 800;
canvas.height = 600;
var gl = canvas.getContext("webgl2");

// TODO : UBAH ROTATION DAN SCALING KE LOCAL
// TODO : JANGAN CUMAN SELECT DOANG TAPI BISA TARIK VERTEX

let appState = {
  mousePos: {
    x: 0,
    y: 0,
  },
  oldPickColor: [],
  oldPick: -1,
};

async function main() {
  // Checks if browser supports WebGL
  if (!gl) {
    alert("Your browser does not support WebGL");
    return;
  }
  // if so, continue on
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Adds an evvent listener to the canvas to get the current mouse position
  canvas.addEventListener(
    "mousemove",
    (event) => {
      const bound = canvas.getBoundingClientRect();
      const res = {
        x: event.clientX - bound.left,
        y: event.clientY - bound.top,
      };
      appState.mousePos = res;
    },
    false
  );
  canvas.addEventListener(
    "mouseleave",
    (event) => {
      appState.mousePos = {
        x: 0,
        y: 0,
      };
    },
    false
  );

  // const triangleData = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0]; // in clip space
  // const triangleData = [400, 400.0, 400.0, 200.0, 200.0, 400.0]; // in pixel space
  // const triangleData = [0, 0, 200, 0, 0, 200]; // in pixel space
  // const triangleData = [-100, -100, 0, 100, 100, -100]; // in pixel space
  const triangleDataCentered = [-100, -100, 0, 100, 100, -100]; // in pixel space
  const triangleData = [100, 100, 200, 300, 300, 100]; // in pixel space

  const selectedColor = [0.9, 0.1, 0.1, 1.0];

  const shaderProgram = await initShaderFiles(
    gl,
    "draw-vert.glsl",
    "draw-frag.glsl"
  );

  // Converts gl program from using clip space (so... 1.0 is the rightmost placement of the canvas) into the pixel space
  gl.useProgram(shaderProgram);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const u_resolution = gl.getUniformLocation(shaderProgram, "u_resolution");
  gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);

  // Selection Shader Program
  const selectProgram = await initShaderFiles(
    gl,
    "select-vert.glsl",
    "select-frag.glsl"
  );

  // Some... texture stuffs
  // defining texture buffer
  const texBuf = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texBuf);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // defining depth buffer
  const depBuf = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
  function setFrameBufferAttatchmentSizes(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );
  }
  setFrameBufferAttatchmentSizes(gl.canvas.width, gl.canvas.height);

  // defining frame buffer
  const frameBuf = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const lvl = 0;

  // using the texture and depth buffer with frame buffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    texBuf,
    lvl
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depBuf
  );

  // GL object instantiation

  // These should probably be instantly put into an array
  const glObject = new GLObject(1, shaderProgram, gl);
  glObject.setVertexArray(triangleDataCentered);
  glObject.SetColorByArray([0.88, 0.72, 0.1, 1.0]);
  glObject.setPosition(0, 0);
  glObject.setRotation(0);
  glObject.setScale(2, 1);
  glObject.assignProjectionMatrix();
  // glObject.centerOriginsSetOffsetAndFixVertices();
  glObject.bind();
  // glObject.draw();

  const glObject2 = new GLObject(4, shaderProgram, gl);
  glObject2.setVertexArray(triangleData);
  glObject2.setColor(0.8, 0.1, 0.86, 1.0);
  glObject2.setPosition(400, 300);
  glObject2.setRotation(180);
  glObject2.setScale(2, 1);
  glObject2.centerOriginsSetOffsetAndFixVertices();
  glObject2.assignProjectionMatrix();
  glObject2.bind();
  // glObject2.draw();

  // const glObject3 = new GLObject(8, shaderProgram, gl);
  // glObject3.setVertexArray(triangleDataCentered);
  // glObject3.setColor(0.2, 0.3, 0.86, 1.0);
  // glObject3.setPosition(400, 300);
  // glObject3.setRotation(90);
  // glObject3.setScale(1, 1);
  // glObject3.centerOriginsSetOffsetAndFixVertices();
  // glObject3.assignProjectionMatrix();
  // glObject3.bind();

  // Creates a renderer and renders the previous objects
  const renderer = new Renderer();
  renderer.addObject(glObject);
  renderer.addObject(glObject2);
  // renderer.addObject(glObject3);
  renderer.render();

  function render(now) {
    // rotateAllObjects();
    // actual render function here
    // renderer.objectList[0].va[0] += 1;
    // renderer.objectList[0].bind();
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // drawing texture
    const frameBuffer = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(selectProgram);
    const resolutionPos = gl.getUniformLocation(selectProgram, "u_resolution");
    gl.uniform2f(resolutionPos, gl.canvas.width, gl.canvas.height);
    renderer.renderTex(selectProgram);
    // getting the pixel value
    const pixelX = (appState.mousePos.x * gl.canvas.width) / canvas.clientWidth;
    const pixelY =
      gl.canvas.height -
      (appState.mousePos.y * gl.canvas.height) / canvas.clientHeight -
      1;
    const data = new Uint8Array(4);
    gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);

    recolorSelectedObject(id);

    // console.log(id);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // draw the actual objects
    gl.useProgram(shaderProgram);
    renderer.render();
    requestAnimationFrame(render);
  }

  // rotate the objects
  function rotateAllObjects() {
    renderer.objectList.forEach((element) => {
      element.setRotation(element.rot + 1);
      element.assignProjectionMatrix();
    });
  }

  function recolorSelectedObject(id) {
    // Recolors the selected object
    if (id != -1) {
      var selObj = renderer.objectList.find((x) => x.id === id);

      // Resets the old object color
      if (id != appState.oldPick.id) {
        resetSelObjColor();
      }
      appState.oldPickColor = selObj.color;
      appState.oldPick = selObj.id;
      selObj.SetColorByArray(selectedColor);
    }

    // console.log("oldPickColor : " + appState.oldPickColor);
    else {
      if (appState.oldPick != -1) {
        resetSelObjColor();
      }
      appState.oldPick = -1;
    }

    function resetSelObjColor() {
      if (appState.oldPick != -1) {
        var oldSelObj = renderer.objectList.find(
          (x) => x.id === appState.oldPick
        );
        oldSelObj.SetColorByArray(appState.oldPickColor);
      }
    }
  }

  requestAnimationFrame(render);

  // End of main
}

main();
