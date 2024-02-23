import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import basicVertex from './shaders/basicVertex.js';
import basicFragment from './shaders/basicFragment.js';
import CanvasControl from './canvasControl.js';

var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");
var zoomSlider = document.getElementById("zoom");
var vectorInputs = document.getElementById("vector-input").children;

const displayScale = 0.6;
const axisWidth = 0.04;
const cellSize = 1;
const gridSize = 20;

const frustumAspectRatio = demoCanvas.offsetWidth / demoCanvas.offsetHeight;
var zoom = zoomSlider.value;

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

let uniforms = {
    transformation: { type: 'mat4', value: matrix },
    color: { type: 'vec3', value: new THREE.Vector3(1, 1, 1) }
};

var canvasControl = new CanvasControl(demoCanvas, camera, new THREE.Vector3(0, 0, 0), 1.25);
canvasControl.enabled = true;

/*
// trackball rotation
const mouseSensitivity = 2.5;
var mouseDown = false;
var azimuthAngle = 0;
var elevationAngle = 0;
var mouseX;
var mouseY;

demoCanvas.addEventListener("mousemove", onMouseMove, false);
demoCanvas.addEventListener("mousedown", onMouseDown, false);
demoCanvas.addEventListener("mouseup", onMouseUp, false);
demoCanvas.addEventListener("wheel", onWheel, false);

function rotateCamera(camera, deltaX, deltaY) {
    azimuthAngle += deltaX * mouseSensitivity;
    elevationAngle = clamp(elevationAngle + deltaY * mouseSensitivity, -Math.PI / 2, Math.PI / 2);
    camera.position.x = Math.cos(azimuthAngle) * Math.cos(elevationAngle) * zoom;
    camera.position.y = Math.sin(elevationAngle) * zoom;
    camera.position.z = Math.sin(azimuthAngle) * Math.cos(elevationAngle) * zoom;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onWheel(e) {
    e.preventDefault();
    zoom = clamp(zoom + e.deltaY * 0.01, zoomSlider.min, zoomSlider.max);
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
}*/

// change camera type functions
function setCamera2D() {
    camera = oCamera;
    perspectiveCameraEnabled = false;
    //canvasControl.enabled = false;
}
window.setCamera2D = setCamera2D;

function setCamera3D() {
    camera = pCamera;
    perspectiveCameraEnabled = true;
    canvasControl.enabled = true;
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
    lineMaterial.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.4, 0.4, 0.4)};
    const arrowMaterial = baseMaterial.clone();
    arrowMaterial.uniforms.color = {type: 'vec3', value: new THREE.Vector3(1.0, 0.0, 0.0)};

    // create objects
    sceneObjects.push(createGridMesh(scene, lineMaterial, cellSize, gridSize));
    sceneObjects.push(createBoxMesh(scene, axisMaterial, gridSize * 2, axisWidth, axisWidth));
    sceneObjects.push(createBoxMesh(scene, axisMaterial, axisWidth, gridSize * 2, axisWidth));
    sceneObjects.push(createBoxMesh(scene, axisMaterial, axisWidth, axisWidth, gridSize * 2));
    sceneObjects.push(createArrowMesh(scene, arrowMaterial, 0.05, 0.4, 0.8));
    animate();
}

// render loop
function animate() {
    requestAnimationFrame(animate);
    zoomSlider.value = zoom;
    if (!perspectiveCameraEnabled) 
        updateOrthographicCameraSize(camera, frustumAspectRatio * zoom / -2, frustumAspectRatio * zoom / 2, zoom / 2, zoom / -2);
    else canvasControl.rotateCamera(camera, 0, 0);
    zoom = canvasControl.zoom;
    drawVector(sceneObjects[4], new THREE.Vector3(0, 0, 0), new THREE.Vector3(vectorInputs.item(0).value, vectorInputs.item(1).value, vectorInputs.item(2).value));
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
init();