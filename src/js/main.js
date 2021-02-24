async function main() {
  // Checks if browser supports WebGL
  if (!gl) {
    alert("Your browser does not support WebGL");
    return;
  }
  // if so, continue on
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const shaderProgram = await initShaderFiles(
    gl,
    "draw-vert.glsl",
    "draw-frag.glsl"
  );

  shaderProgramGlobal = shaderProgram;

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

  //
  // DEBUG CALLS HERE
  //

  // drawDebugObjects(shaderProgram);

  //
  // END DEBUG CALLS
  //

  function render(now) {
    gl.clearColor(
      defClearColor[0],
      defClearColor[1],
      defClearColor[2],
      defClearColor[3]
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // drawing texture
    const frameBuffer = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    // Depth Test
    // gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(selectProgram);
    const resolutionPos = gl.getUniformLocation(selectProgram, "u_resolution");
    gl.uniform2f(resolutionPos, gl.canvas.width, gl.canvas.height);
    renderer.renderTex(selectProgram);
    draggerRenderer.renderTex(selectProgram);

    // getting the pixel value
    const pixelX = (appState.mousePos.x * gl.canvas.width) / canvas.clientWidth;
    const pixelY =
      gl.canvas.height -
      (appState.mousePos.y * gl.canvas.height) / canvas.clientHeight -
      1;
    const data = new Uint8Array(4);
    gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    appState.selId = id;

    showObjId(id, "hov-id");

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // draw the actual objects
    gl.useProgram(shaderProgram);
    renderer.render();
    draggerRenderer.render();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // End of main
}

main();
