const basicVertex = /*glsl*/`
uniform mat4 transformation;

void main() {
    vec4 modelViewPosition = modelViewMatrix * transformation * vec4(position, 1.0);
    gl_Position =  projectionMatrix * modelViewPosition;
}`;
export default basicVertex;