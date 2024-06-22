import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';
import * as Objects from './sceneObjects.js'
import DemoScene from './demoScene.js';

// constants
const arrowbodyWidth = 0.04;
const arrowheadWidth = 0.16;
const arrowheadLength = 0.25;
const transformTransitionTime = 1; // in seconds
const transformTransitionFPS = 30;

// settings to control demo
var vectorInput = document.getElementById("vector-input");
var additionInput = document.getElementById("vector-addition-input");
var scalarInput = document.getElementById("scalar-input");
var zoomSlider = document.getElementById("zoom-slider");
var additionMenu = document.getElementById("vector-addition-menu");
var multiplicationMenu = document.getElementById("scalar-multiplication-menu");
var showComponentVectors = true;
var showAdditionMenu = true;

// configure demo scene
var demoCanvas = document.getElementById("vector-demo-canvas");
var demoContainer = demoCanvas.parentElement;
var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;
var objs = demoScene.sceneObjects;

// add materials to demo scene
demoScene.addMaterialWithColor('xArrowMat', new THREE.Vector3(1.0, 0.0, 0.0));
demoScene.addMaterialWithColor('yArrowMat', new THREE.Vector3(0.0, 0.0, 1.0));
demoScene.addMaterialWithColor('zArrowMat', new THREE.Vector3(0.0, 1.0, 0.0));
demoScene.addMaterialWithColor('addArrowMat', new THREE.Vector3(1.0, 1.0, 0.0));

// add meshes to demo scene
objs.vector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.arrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.xComponentVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.xArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.yComponentVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.yArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.zComponentVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.zArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.addVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.addArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
toggleComponentVectors();

// once document is fully loaded, set dimension and start drawing
document.addEventListener('DOMContentLoaded', (e) => {
    setDemo2D();
    displayVectorAdditionMenu();
    demoScene.animate(anim);
});

function anim() {
    zoomSlider.value = demoScene.zoom;

    // read the values so the input appears in the form XZY
    let vec = Utils.readVectorInput3(vectorInput);
    let addVec = Utils.readVectorInput3(additionInput);

    // draw meshes
    Objects.drawGridLines(objs.grid);
    Objects.drawArrow(objs.vector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vec.x, vec.y, vec.z));
    Objects.drawArrow(objs.xComponentVector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vec.x, 0, 0));
    Objects.drawArrow(objs.zComponentVector, new THREE.Vector3(vec.x, 0, 0), new THREE.Vector3(0, 0, vec.z));
    Objects.drawArrow(objs.yComponentVector, new THREE.Vector3(vec.x, 0, vec.z), new THREE.Vector3(0, vec.y, 0));
    Objects.drawArrow(objs.addVector, new THREE.Vector3(vec.x, vec.y, vec.z), new THREE.Vector3(addVec.x, addVec.y, addVec.z));
}

// update zoom when slider is adjusted manually
zoomSlider.oninput = (e) => {
    if (e.isTrusted) {
        e.preventDefault();
        demoScene.zoom = zoomSlider.value;
    }
}

function setInputDimension(dimension) {
    Utils.setVectorInputDimension(vectorInput, dimension);
    Utils.setVectorInputDimension(additionInput, dimension);
}

// set demo dimension to 2D
function setDemo2D() {
    demoScene.setCamera2D();
    setInputDimension(2);
}

// set demo dimension to 3D
function setDemo3D() {
    demoScene.setCamera3D();
    setInputDimension(3);
}

function displayVectorAdditionMenu() {
    showAdditionMenu = true;
    additionMenu.style.display = 'flex';
    multiplicationMenu.style.display = 'none';
}

function displayScalarMultiplicationMenu() {
    showAdditionMenu = false;
    additionMenu.style.display = 'none';
    multiplicationMenu.style.display = 'flex';
}

function evaluateOperation() {
    if (showAdditionMenu) {
        let vector = Utils.readVectorInput3(vectorInput);
        let additionVector = Utils.readVectorInput3(additionInput);
        Utils.setVectorInput3(vectorInput,  Number(vector.x) +  Number(additionVector.x),  Number(vector.y) +  Number(additionVector.y),  Number(vector.z) +  Number(additionVector.z));
    }
    else {
        let vector = Utils.readVectorInput3(vectorInput);
        let scalar = scalarInput.value;
        Utils.setVectorInput3(vectorInput, Number(scalar) * Number(vector.x),  Number(scalar) *  Number(vector.y),  Number(scalar) *  Number(vector.z));
    }
}

// toggle visible component vectors
function toggleComponentVectors() {
    showComponentVectors = !showComponentVectors;
    Objects.setArrowVisiblity(objs.xComponentVector, showComponentVectors);
    Objects.setArrowVisiblity(objs.yComponentVector, showComponentVectors);
    Objects.setArrowVisiblity(objs.zComponentVector, showComponentVectors);
}

window.setDemo2D = setDemo2D;
window.setDemo3D = setDemo3D;
window.toggleComponentVectors = toggleComponentVectors;
window.displayVectorAdditionMenu = displayVectorAdditionMenu;
window.displayScalarMultiplicationMenu = displayScalarMultiplicationMenu;
window.evaluateOperation = evaluateOperation;