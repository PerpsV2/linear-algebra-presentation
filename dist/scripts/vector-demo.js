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

// settings
var vectorInputs = document.getElementById("vector-input").children;
var matrixInputs = document.getElementById("matrix-input").children;
var zoomSlider = document.getElementById("zoom-slider");
var showComponentVectors = true;

// configure demo scene
var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");
var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;
var inputTransformation = getTransformation();

// create scene objects
var objs = demoScene.sceneObjects;
objs.vector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.arrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);

// create component vectors
var xArrowMat = demoScene.addMaterial("xArrowMat");
xArrowMat.uniforms.color = {type: 'vec3', value: new THREE.Vector3(1.0, 0.0, 0.0)};

var yArrowMat = demoScene.addMaterial("yArrowMat");
yArrowMat.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.0, 0.0, 1.0)};

var zArrowMat = demoScene.addMaterial("zArrowMat");
zArrowMat.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.0, 1.0, 0.0)};

objs.xComponentVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.xArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.yComponentVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.yArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.zComponentVector = Objects.createArrowMesh(demoScene.scene, demoScene.materials.zArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
toggleComponentVectors();

// begin with 2D inputs
setInputDimension(2);

function anim() {
    zoomSlider.value = demoScene.zoom;

    // read the values so the input appears in the form XZY
    let vecX = vectorInputs[0].value;
    let vecY = vectorInputs[2].value; 
    let vecZ = vectorInputs[1].value; 
    let transform = inputTransformation;

    // apply transformation to materials
    let transformUniform = {type: "mat4", value:transform};
    demoScene.materials.xArrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.yArrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.zArrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.arrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.lineMat.uniforms.transformation = transformUniform;

    // draw special objects
    Objects.drawGridLines(objs.grid);
    Objects.drawArrow(objs.vector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vecX, vecY, vecZ));
    Objects.drawArrow(objs.xComponentVector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vecX, 0, 0));
    Objects.drawArrow(objs.zComponentVector, new THREE.Vector3(vecX, 0, 0), new THREE.Vector3(0, 0, vecZ));
    Objects.drawArrow(objs.yComponentVector, new THREE.Vector3(vecX, 0, vecZ), new THREE.Vector3(0, vecY, 0));
}

// update zoom when slider is adjusted manually
zoomSlider.oninput = function(e) {
    if (e.isTrusted) {
        e.preventDefault();
        demoScene.zoom = zoomSlider.value;
    }
}

function setInputDimension(dimension) {
    // disabled/enable the inputs used for the third dimension
    var matrixInputsArray = Array.from(matrixInputs);
    matrixInputsArray.filter((input) => input.dataset.dimension > dimension).forEach((input) => {input.disabled = true; input.value = input.dataset.default;});
    matrixInputsArray.filter((input) => input.dataset.dimension <= dimension).forEach((input) => input.disabled = false);

    var vectorInputsArray = Array.from(vectorInputs);
    vectorInputsArray.filter((input) => input.dataset.dimension > dimension).forEach((input) => {input.disabled = true; input.value = input.dataset.default;});
    vectorInputsArray.filter((input) => input.dataset.dimension <= dimension).forEach((input) => input.disabled = false);
}

// read transformation from settings
function getTransformation() {
    return new THREE.Matrix4
    (matrixInputs[0].value, matrixInputs[2].value, matrixInputs[1].value, 0,
     matrixInputs[6].value, matrixInputs[8].value, matrixInputs[7].value, 0,
    -matrixInputs[3].value,-matrixInputs[5].value,-matrixInputs[4].value, 0,
     0                    , 0                    , 0                    , 1);
}

// update the current transformation from settings and slowly transition to it
function applyTransformation() {
    var transitionProgress = 0;
    var intervalId;
    
    // loop function to iterate through transition
    var progressTransformation = function() {
        if (Utils.nearlyEqual(transitionProgress, 1, 0.0001) || transitionProgress > 1) {
            clearInterval(intervalId);
            return;
        }
        transitionProgress += 1 / transformTransitionTime / transformTransitionFPS;
    }

    inputTransformation = getTransformation();
    intervalId = setInterval(progressTransformation, 1 / transformTransitionFPS);
}

function setDemo2D() {
    demoScene.setCamera2D();
    setInputDimension(2);
}

function setDemo3D() {
    demoScene.setCamera3D();
    setInputDimension(3);
}

function toggleComponentVectors() {
    showComponentVectors = !showComponentVectors;
    Objects.setArrowVisiblity(objs.xComponentVector, showComponentVectors);
    Objects.setArrowVisiblity(objs.yComponentVector, showComponentVectors);
    Objects.setArrowVisiblity(objs.zComponentVector, showComponentVectors);
}

window.setDemo2D = setDemo2D;
window.setDemo3D = setDemo3D;
window.applyTransformation = applyTransformation;
window.toggleComponentVectors = toggleComponentVectors;

// run animation
demoScene.animate(anim);