class GLObjectLine extends GLObject{
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
	    gl.drawArrays(gl.LINES, 0, 2);
	    
	    console.log("REEEE");
	  }
}