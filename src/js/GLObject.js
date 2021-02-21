class GLObject {
  constructor(id, shader, gl) {
    // id is a number, shader is a webgl program. gl is a WebGL context
    this.id = id;
    this.shader = shader;
    this.gl = gl;

    // these will be set later
    this.va = []; // Array of vertices (so... array of int or float)
    this.color = [0.0, 0.0, 0.0, 1.0]; // Tuple of RGBA // Defaults to fully opaque black
    this.pos; // [0, 0]; // The position, an "array" (well, it's really a tuple) of x and y (defaults to 0 and 0 (origin), please)
    this.rot; // 0; // Rotation (in int/float), defaults to 0, please
    this.scale; // [1, 1]; // The scale, an "array" (well, it's really a tuple) of x and y (defaults to 1 and 1, please)
    this.projectionMat = []; // []; // The projection matrix... a 1d matrix of numbers (int/float)
  }
  setVertexArray(va) {
    // Array of vertices (so... array of int or float)
    this.va = va;
  }

  SetColorByArray(RGBATuple) {
    this.color = RGBATuple;
  }

  setColor(Red, Green, Blue, Alpha) {
    this.color = [Red, Green, Blue, Alpha];
  }

  setPosition(x, y) {
    // The position, an "array" (well, it's really a tuple) of x and y
    this.pos = [x, y];
  }

  setRotation(rot) {
    // Rotation (in int/float)
    this.rot = rot;
  }

  setScale(x, y) {
    // The scale, an "array" (well, it's really a tuple) of x and y (defaults to 1 and 1)
    this.scale = [x, y];
  }

  calcProjectionMatrix() {
    if (
      this.pos === undefined ||
      this.rot === undefined ||
      this.scale === undefined
    ) {
      return null;
    }

    const [u, v] = this.pos;
    const translateMat = [1, 0, 0, 0, 1, 0, u, v, 1];
    const degrees = this.rot;
    const rad = (degrees * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const rotationMat = [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
    const [k1, k2] = this.scale;
    const scaleMat = [k1, 0, 0, 0, k2, 0, 0, 0, 1];
    const projectionMat = multiplyMatrix(
      multiplyMatrix(rotationMat, scaleMat, 3),
      translateMat,
      3
    );
    return projectionMat;
  }

  assignProjectionMatrix() {
    // assigns the projection matrix to this object
    this.projectionMat = this.calcProjectionMatrix();
    // console.log("Proj Mat : " + this.projectionMat);
  }

  bind() {
    // creates a new vertex buffer and bind the vertex array of this object to the buffer
    const gl = this.gl;
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.va), gl.STATIC_DRAW);
  }

  draw() {
    //
    const gl = this.gl;
    gl.useProgram(this.shader);
    var vertexPos = gl.getAttribLocation(this.shader, "a_pos");
    var uniformCol = gl.getUniformLocation(this.shader, "u_fragColor");
    var uniformPos = gl.getUniformLocation(this.shader, "u_proj_mat");
    gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix3fv(uniformPos, false, this.projectionMat);
    gl.uniform4fv(uniformCol, this.color);
    gl.enableVertexAttribArray(vertexPos);
    gl.drawArrays(gl.TRIANGLES, 0, this.va.length / 2);

    // console.log("REEEE");
  }

  drawSelect(selectProgram) {
    // selectProgram is a WebGL shader program... with selection shaders
    const gl = this.gl;
    const id = this.id;
    gl.useProgram(selectProgram);
    var vertexPos = gl.getAttribLocation(selectProgram, "a_pos");
    var uniformCol = gl.getUniformLocation(selectProgram, "u_fragColor");
    var uniformPos = gl.getUniformLocation(selectProgram, "u_proj_mat");
    gl.uniformMatrix3fv(uniformPos, false, this.projectionMat);
    gl.vertexAttribPointer(
      vertexPos,
      2, // it's 2 dimensional
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(vertexPos);
    const uniformId = [
      ((id >> 0) & 0xff) / 0xff,
      ((id >> 8) & 0xff) / 0xff,
      ((id >> 16) & 0xff) / 0xff,
      ((id >> 24) & 0xff) / 0xff,
    ];
    gl.uniform4fv(uniformCol, uniformId);
    gl.drawArrays(gl.TRIANGLES, 0, this.va.length / 2);
  }
}
