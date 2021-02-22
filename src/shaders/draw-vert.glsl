attribute vec2 a_pos;
uniform mat3 u_proj_mat;
uniform vec2 u_resolution;

void main(){
    // Multiply each vertex position by the projection matrix.
    vec2 position=(u_proj_mat*vec3(a_pos,1)).xy;
    
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne=position/u_resolution;
    
    // convert from 0->1 to 0->2
    vec2 zeroToTwo=zeroToOne*2.;
    
    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace=zeroToTwo-1.;
    
    gl_Position=vec4(clipSpace,0,1);
}