class GLObjectRectangle extends GLObject{
	constructor(id, shader, gl){
		super(id, shader, gl);
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
	    gl.drawArrays(gl.TRIANGLES, 0, 6);
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
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
