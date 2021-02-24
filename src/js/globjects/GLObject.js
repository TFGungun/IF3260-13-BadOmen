class GLObject {
  constructor(id, shader, gl) {
    // id is a number, shader is a webgl program. gl is a WebGL context
    this.id = id; // ID GLOBJECT HARUS >= 1
    this.shader = shader;
    this.gl = gl;

    // these will be set later
    this.va = []; // Array of vertices (so... array of int or float)
    this.color = [0.0, 0.0, 0.0, 1.0]; // Tuple of RGBA // Defaults to fully opaque black
    this.pos; // [0, 0]; // The position, an "array" (well, it's really a tuple) of x and y (defaults to 0 and 0 (origin), please)
    this.rot; // 0; // Rotation (in int/float), defaults to 0, please
    this.scale; // [1, 1]; // The scale, an "array" (well, it's really a tuple) of x and y (defaults to 1 and 1, please)
    this.projectionMat = []; // []; // The projection matrix... a 1d matrix of numbers (int/float)

    // for origin and offset
    this.origin; // the position of the origin, preferably somewhere near the center of the object
    this.offset = [0, 0]; // the offset, this will be added to the translation of the object... it is separated so that the translation can still act as if this doesn't exist

    this.temp = 0;
  }

  setVertexArray(va) {
    // Array of vertices (so... array of int or float)
    // this.va = [...va];
    this.va = va.slice();
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
    const uo = this.offset.slice()[0];
    const vo = this.offset.slice()[1];
    const origMat = [1, 0, 0, 0, 1, 0, uo, vo, 1];
    const negaOrigMat = [1, 0, 0, 0, 1, 0, -uo, -vo, 1];
    if (this.temp < 5) {
      // console.log("origMat[" + this.id + "] : " + origMat);
    }

    const u = this.pos[0]; //- this.offset[0] / 2;
    const v = this.pos[1]; //- this.offset[1] / 2;
    const translateMat = [1, 0, 0, 0, 1, 0, u, v, 1];
    // const translateMat = multiplyMatrix(
    //   multiplyMatrix(origMat, translateMatOld, 3),
    //   -origMat,
    //   3
    // );

    const degrees = this.rot;
    const rad = (degrees * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const rotationMat = [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
    const [k1, k2] = this.scale;
    const scaleMat = [k1, 0, 0, 0, k2, 0, 0, 0, 1];
    // const projectionMat = multiplyMatrix(
    //   multiplyMatrix(rotationMat, scaleMat, 3),
    //   translateMat,
    //   3
    //   // multiplyMatrix(translateMat, rotationMat, 3),
    //   // scaleMat,
    //   // 3
    // );

    const projectionMat =
      // multiplyMatrix(
      multiplyMatrix(
        multiplyMatrix(
          multiplyMatrix(
            multiplyMatrix(negaOrigMat, rotationMat, 3),
            // rotationMat,
            origMat,
            3
          ),
          multiplyMatrix(
            multiplyMatrix(negaOrigMat, scaleMat, 3),
            // rotationMat,
            origMat,
            3
          ),
          // scaleMat,
          3
        ),
        translateMat,
        3
        // ),
        // negaOrigMat,
        // 3
      );
    if (this.temp < 5) {
      // console.log("rotationMat : " + rotationMat);
      // console.log("origMat : " + origMat);
      // console.log(
      //   "multiplyMatrix(multiplyMatrix(-origMat, rotationMat, 3) : " +
      //     multiplyMatrix(multiplyMatrix(-origMat, rotationMat, 3))
      // );
      // console.log("projectionMat[" + this.id + "] : " + projectionMat);
      this.temp += 1;
    }
    return projectionMat;
  }

  assignProjectionMatrix() {
    // assigns the projection matrix to this object
    this.projectionMat = this.calcProjectionMatrix().slice();
    // // console.log("Proj Mat : " + this.projectionMat);
  }

  centerOriginsSetOffsetAndFixVertices() {
    // console.log("ORIGINAL VA : " + this.va);

    var numOfVertices = this.va.length;

    var minX, maxX, minY, maxY;
    for (var i = 0; i < numOfVertices; i++) {
      minX = this.va[i] < minX || minX == null ? this.va[i] : minX;
      maxX = this.va[i] > maxX || maxX == null ? this.va[i] : maxX;
      minY = this.va[i + 1] < minY || minY == null ? this.va[i + 1] : minY;
      maxY = this.va[i + 1] > maxY || maxY == null ? this.va[i + 1] : maxY;
    }
    var tempOrigins = [(minX + maxX) / 2, (minY + maxY) / 2];

    this.origin = tempOrigins;
    // console.log("Origins : " + this.origin);

    this.offset = [this.origin[0], this.origin[1]].slice();
    // var tempVa = [];
    // for (let i = 0; i < numOfVertices; i = i + 2) {
    //   // if (this.va[i] < this.origin[0]) {
    //   //   this.va[i] -= this.origin[0];
    //   // } else {
    //   //   this.va[i] += this.origin[0];
    //   // }
    //   tempVa[i] = this.va[i] - this.origin[0];

    //   tempVa[i + 1] = this.va[i + 1] - this.origin[1];
    //   // if (this.va[i + 1] < this.origin[1]) {
    //   //   this.va[i + 1] -= this.origin[1];
    //   // } else {
    //   //   this.va[i + 1] += this.origin[1];
    //   // }
    // }
    // this.setVertexArray(tempVa);

    // console.log("CORECCTED VA : " + this.va);
    this.assignProjectionMatrix();

    // function uniq_fast(array) {
    //   var seen = {};
    //   var out = [];
    //   var len = array.length;
    //   var j = 0;
    //   for (var i = 0; i < len; i++) {
    //     var item = array[i];
    //     if (seen[item] !== 1) {
    //       seen[item] = 1;
    //       out[j++] = item;
    //     }
    //   }
    //   return out;
    // }
  }

  bind() {
    // creates a new vertex buffer and bind the vertex array of this object to the buffer
    const gl = this.gl;
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.va), gl.STATIC_DRAW);
  }

  unbind() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw() {
    // Gonna delete this later

    if (this.temp < 20) {
      // this.temp++;
      // // console.log(this.va);
    }
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

    // // console.log("REEEE");
  }

  drawSelect(selectProgram) {
    // Gonna delete this later
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
