import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import basicVertex from './shaders/basicVertex.js';
import basicFragment from './shaders/basicFragment.js';

var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");
var zoomSlider = document.getElementById("zoom");

const displayScale = 0.6;
const axisWidth = 0.04;
const cellSize = 1;
const gridSize = 20;

const frustumAspectRatio = demoCanvas.offsetWidth / demoCanvas.offsetHeight;
var zoom = 1;

var scene;
var oCamera;
var pCamera;
var camera;
var renderer;
var sceneObjects = [];
var perspectiveCameraEnabled = false;

const matrix = new THREE.Matrix4();
matrix.set (1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);

const uniforms = {
    transformation: { type: 'mat4', value: matrix },
    color: { type: 'vec3', value: new THREE.Vector3(1, 1, 1) }
};

// trackball rotation
const mouseSensitivity = 2.5;
var mouseDown = false;
var mouseX;
var mouseY;
var azimuthAngle = 0;
var elevationAngle = 0;

demoCanvas.addEventListener("mousemove", onMouseMove, false);
demoCanvas.addEventListener("mousedown", onMouseDown, false);
demoCanvas.addEventListener("mouseup", onMouseUp, false);

function rotateCamera(camera, deltaX, deltaY) {
    azimuthAngle += deltaX * mouseSensitivity;
    elevationAngle = clamp(elevationAngle + deltaY * mouseSensitivity, -Math.PI / 2, Math.PI / 2);
    camera.position.x = Math.cos(azimuthAngle) * Math.cos(elevationAngle) * zoom;
    camera.position.y = Math.sin(elevationAngle) * zoom;
    camera.position.z = Math.sin(azimuthAngle) * Math.cos(elevationAngle) * zoom;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onMouseMove(e) {
    if (!mouseDown) return;
    if (perspectiveCameraEnabled) {
        e.preventDefault();
        var deltaX = (e.clientX - mouseX) * 0.001;
        var deltaY = (e.clientY - mouseY) * 0.001;
        mouseX = e.clientX;
        mouseY = e.clientY;
        rotateCamera(pCamera, deltaX, deltaY);
    }
}

function onMouseDown(e) {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseDown = true;
}

function onMouseUp(e) {
    e.preventDefault();
    mouseDown = false;
}

// change camera type functions
function setCamera2D() {
    camera = oCamera;
    perspectiveCameraEnabled = false;
}
window.setCamera2D = setCamera2D;

function setCamera3D() {
    camera = pCamera;
    perspectiveCameraEnabled = true;
}
window.setCamera3D = setCamera3D;

// initialize scene, camera, renderer and all the objects which will be rendered
function init() {
    // create scene
    scene = new THREE.Scene();

    // create cameras
    oCamera = new THREE.OrthographicCamera(frustumAspectRatio * zoom / -2, frustumAspectRatio * zoom / 2, zoom / 2, zoom / -2, 0.1, 1000);
    pCamera = new THREE.PerspectiveCamera(75, frustumAspectRatio, 0.1, 1000);
    setCamera2D();

    // create renderer
    renderer = new THREE.WebGLRenderer({canvas: demoCanvas});
    renderer.setClearColor(0x252525, 1);
    renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
    demoContainer.appendChild(renderer.domElement);

    // set camera default positions
    pCamera.position.y = zoom;
    oCamera.position.y = zoom;
    pCamera.lookAt(0, 0, 0);
    oCamera.lookAt(0, 0, 0);

    const baseMaterial = new THREE.ShaderMaterial({
        fragmentShader: basicFragment,
        vertexShader: basicVertex,
        uniforms: uniforms
    });

    // set materials
    const axisMaterial = baseMaterial.clone();
    const lineMaterial = baseMaterial.clone();
    lineMaterial.uniforms.color = { type: 'vec3', value: new THREE.Vector3(0.4, 0.4, 0.4) };

    // create objects
    sceneObjects = sceneObjects.concat(createGridMesh(lineMaterial, cellSize, gridSize));
    sceneObjects.push(createCubeMesh(axisMaterial, gridSize * 2, axisWidth, axisWidth));
    sceneObjects.push(createCubeMesh(axisMaterial, axisWidth, gridSize * 2, axisWidth));
    sceneObjects.push(createCubeMesh(axisMaterial, axisWidth, axisWidth, gridSize * 2));

    // add objects to the scene
    for (let object of sceneObjects) scene.add(object);
    animate();
}

// render loop
function animate() {
    requestAnimationFrame(animate);
    zoom = zoomSlider.value;
    if (!perspectiveCameraEnabled) 
        updateOrthographicCameraSize(oCamera, frustumAspectRatio * zoom / -2, frustumAspectRatio * zoom / 2, zoom / 2, zoom / -2);
    else rotateCamera(pCamera, 0, 0);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
init();