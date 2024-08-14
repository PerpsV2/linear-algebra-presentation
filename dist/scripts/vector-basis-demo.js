import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';
import * as Objects from './sceneObjects.js'
import DemoScene from './demoScene.js';

// constants
const arrowbodyWidth = 0.04;
const arrowheadWidth = 0.16;
const arrowheadLength = 0.25;

const componentBodyWidth = 0.02;
const componentHeadWidth = 0.08;
const componentHeadLength = 0.13;

// settings to control demo
var vectorInput = document.getElementById("vector-input");
var xBasisInput = document.getElementById("x-basis-input");
var yBasisInput = document.getElementById("y-basis-input");
var zBasisInput = document.getElementById("z-basis-input");
var zoomSlider = document.getElementById("zoom-slider");
var showComponentVectors = true;
var showBasisVectors = true;

// configure demo scene
var demoCanvas = document.getElementById("vector-demo-canvas");
var demoContainer = demoCanvas.parentElement;
var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;

// add materials to demo scene
demoScene.addMaterialWithColor('xArrowMat', new THREE.Vector3(1.0, 0.0, 0.0));
demoScene.addMaterialWithColor('yArrowMat', new THREE.Vector3(0.0, 1.0, 0.0));
demoScene.addMaterialWithColor('zArrowMat', new THREE.Vector3(0.0, 0.0, 1.0));

// add meshes to demo scene
demoScene.addObject('vector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('arrowMat'), arrowbodyWidth, arrowheadWidth, arrowheadLength));
demoScene.addObject('xComponentVector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('xArrowMat'), componentBodyWidth, componentHeadWidth, componentHeadLength));
demoScene.addObject('yComponentVector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('yArrowMat'), componentBodyWidth, componentHeadWidth, componentHeadLength));
demoScene.addObject('zComponentVector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('zArrowMat'), componentBodyWidth, componentHeadWidth, componentHeadLength));
demoScene.addObject('xBasisVector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('xArrowMat'), arrowbodyWidth, arrowheadWidth, arrowheadLength));
demoScene.addObject('yBasisVector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('yArrowMat'), arrowbodyWidth, arrowheadWidth, arrowheadLength));
demoScene.addObject('zBasisVector', Objects.createArrowMesh(demoScene.scene, demoScene.getMaterial('zArrowMat'), arrowbodyWidth, arrowheadWidth, arrowheadLength));
toggleComponentVectors();

// once document is fully loaded, set dimension and start drawing
document.addEventListener('DOMContentLoaded', (e) => {
    Utils.setVectorInput3(xBasisInput, 1, 0, 0);
    Utils.setVectorInput3(yBasisInput, 0, 0, 1);
    setDemo2D();
    demoScene.animate(anim);
});

function anim() {
    zoomSlider.value = demoScene.zoom;

    // read the values so the input appears in the form XZY
    let vec = Utils.readVectorInput3(vectorInput);
    let xBasisVec = Utils.readVectorInput3(xBasisInput);
    let yBasisVec = Utils.readVectorInput3(yBasisInput);
    let zBasisVec = Utils.readVectorInput3(zBasisInput);

    // draw meshes
    Objects.drawGridLines(demoScene.getObject('grid'));
    
    let vecX = xBasisVec.clone().multiplyScalar(vec.x);
    let vecY = yBasisVec.clone().multiplyScalar(vec.z);
    let vecZ = yBasisVec.clone().multiplyScalar(vec.y);
    Objects.drawArrow(demoScene.getObject('vector'), new THREE.Vector3(0, 0, 0), vecX.clone().add(vecY.clone().add(vecZ)));
    Objects.drawArrow(demoScene.getObject('xBasisVector'), new THREE.Vector3(0, 0, 0), new THREE.Vector3(xBasisVec.x, xBasisVec.y, xBasisVec.z));
    Objects.drawArrow(demoScene.getObject('yBasisVector'), new THREE.Vector3(0, 0, 0), new THREE.Vector3(yBasisVec.x, yBasisVec.y, yBasisVec.z));
    Objects.drawArrow(demoScene.getObject('zBasisVector'), new THREE.Vector3(0, 0, 0), new THREE.Vector3(zBasisVec.x, zBasisVec.y, zBasisVec.z));

    let dirX = xBasisVec.clone().normalize();
    let dirY = yBasisVec.clone().normalize();
    let dirZ = zBasisVec.clone().normalize();
    let currentStartingPoint = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < vec.x; ++i) {
        Objects.drawArrow(demoScene.getObject('xComponentVector'), currentStartingPoint, new THREE.Vector3(1, 0, 0));
        currentStartingPoint.add(new THREE.Vector3(1, 0, 0));
    }
}

// update zoom when slider is adjusted manually
zoomSlider.oninput = (e) => {
    if (e.isTrusted) {
        e.preventDefault();
        demoScene.zoom = zoomSlider.value;
    }
}

function setInputDimension(dimension) {
    Utils.setInputDimension(vectorInput, dimension);
    Utils.setInputDimension(xBasisInput, dimension);
    Utils.setInputDimension(yBasisInput, dimension);
    Utils.setInputDimension(zBasisInput, dimension);
}

// set demo dimension to 2D
function setDemo2D() {
    demoScene.setCamera2D();
    setInputDimension(2);
    Utils.setInputState(zBasisInput, false);
    Utils.setVectorInput3(zBasisInput, 0, 0, 0);
}

// set demo dimension to 3D
function setDemo3D() {
    demoScene.setCamera3D();
    setInputDimension(3);
    Utils.setInputState(zBasisInput, true);
    Utils.setVectorInput3(zBasisInput, 0, 1, 0);
}

// toggle visible component vectors
function toggleComponentVectors() {
    showComponentVectors = !showComponentVectors;
    Objects.setArrowVisiblity(demoScene.getObject('xComponentVector'), showComponentVectors);
    Objects.setArrowVisiblity(demoScene.getObject('yComponentVector'), showComponentVectors);
    Objects.setArrowVisiblity(demoScene.getObject('zComponentVector'), showComponentVectors);
}

// toggle visible component vectors
function toggleBasisVectors() {
    showBasisVectors = !showBasisVectors;
    Objects.setArrowVisiblity(demoScene.getObject('xBasisVector'), showBasisVectors);
    Objects.setArrowVisiblity(demoScene.getObject('yBasisVector'), showBasisVectors);
    Objects.setArrowVisiblity(demoScene.getObject('zBasisVector'), showBasisVectors);
}

window.setDemo2D = setDemo2D;
window.setDemo3D = setDemo3D;
window.toggleComponentVectors = toggleComponentVectors;
window.toggleBasisVectors = toggleBasisVectors;