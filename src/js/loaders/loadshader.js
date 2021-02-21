const loadShader = async (gl, type, source) => {
  // gl is a WebGL context, type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER, source is a string

  const rawShader = await fetchShader(source);
  const shader = gl.createShader(type);
  gl.shaderSource(shader, rawShader);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error when compiling shaders: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

async function fetchShader(source) {
  // source is a string
  // fetches the actual shader source file, and return its contents as string
  const shader = await fetch("shaders/" + source).then((res) => res.text());
  return shader;
}

async function initShaderFiles(gl, vert, frag) {
  // gl is a WebGL context, vert is a string, source is a string
  const vs = await loadShader(gl, gl.VERTEX_SHADER, vert);
  const fs = await loadShader(gl, gl.FRAGMENT_SHADER, frag);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vs);
  gl.attachShader(shaderProgram, fs);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Error on initializing shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }
  return shaderProgram;
}
