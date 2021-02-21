// select-vert.glsl
attribute vec2 a_pos;
uniform mat3 u_proj_mat;
uniform vec2 u_resolution;

void main(){
    vec2 position=(u_proj_mat*vec3(a_pos,1)).xy;
    vec2 zeroToOne=position/u_resolution;
    vec2 zeroToTwo=zeroToOne*2.;
    vec2 clipSpace=zeroToTwo-1.;
    gl_Position=vec4(clipSpace,0,1);
}