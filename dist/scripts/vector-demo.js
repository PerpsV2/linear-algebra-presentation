import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import basicVertex from './shaders/basicVertex.js';
import basicFragment from './shaders/basicFragment.js';

var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");
var zoomSlider = document.getElementById("zoom");

const displayScale = 0.6;
const cellSize = 1;
const gridSize = 20;
const axisWidth = 0.04;

const frustumAspectRatio = demoCanvas.offsetWidth / demoCanvas.offsetHeight;
var frustumSize = 2;

var scene;
var camera;
var renderer;
var sceneObjects = [];

const matrix = new THREE.Matrix4();
matrix.set (1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);

let uniforms = {
    transformation: { type: 'mat4', value: matrix },
    color: { type: 'vec3', value: new THREE.Vector3(1, 1, 1) }
};

// initialize scene, camera, renderer and all the objects which will be rendered
function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(frustumAspectRatio * frustumSize / -2, frustumAspectRatio * frustumSize / 2, 
    frustumSize / 2, frustumSize / -2, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({canvas: demoCanvas});
    renderer.setClearColor(0x252525, 1);
    renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
    demoContainer.appendChild(renderer.domElement);

    camera.position.z = 5;

    const axisMaterial = new THREE.ShaderMaterial({
        fragmentShader: basicFragment,
        vertexShader: basicVertex,
        uniforms: uniforms
    });

    const lineMaterial = axisMaterial.clone();
    lineMaterial.uniforms.color = { type: 'vec3', value: new THREE.Vector3(0.4, 0.4, 0.4) };

    sceneObjects = sceneObjects.concat(createGridMesh(lineMaterial, cellSize, gridSize));
    sceneObjects.push(createCubeMesh(axisMaterial, gridSize * 2, axisWidth, axisWidth));
    sceneObjects.push(createCubeMesh(axisMaterial, axisWidth, gridSize * 2, axisWidth));
    sceneObjects.push(createCubeMesh(axisMaterial, axisWidth, axisWidth, gridSize * 2));

    for (let object of sceneObjects) scene.add(object);
    animate();
}

// render loop
function animate() {
    requestAnimationFrame(animate);
    frustumSize = zoomSlider.value;
    updateOrthographicCameraSize(camera, frustumAspectRatio * frustumSize / -2, frustumAspectRatio * frustumSize / 2, frustumSize / 2, frustumSize / -2);
    renderer.render(scene, camera);
}
init();