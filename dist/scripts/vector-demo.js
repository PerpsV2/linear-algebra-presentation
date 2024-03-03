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
var vectorInput = document.getElementById("vector-input");
var matrixInput = document.getElementById("matrix-input");
var zoomSlider = document.getElementById("zoom-slider");
var showComponentVectors = true;

// configure demo scene
var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");
var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;
var objs = demoScene.sceneObjects;

// create scene objects
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

var inputTransformation;

// once document is fully loaded, read input transformation, set dimension and start drawing
document.addEventListener('DOMContentLoaded', (e) => {
    inputTransformation = Utils.readMatrixInput4(matrixInput);
    setInputDimension(2);
    demoScene.animate(anim);
});

function anim() {
    zoomSlider.value = demoScene.zoom;

    // read the values so the input appears in the form XZY
    let vec = Utils.readVectorInput3(vectorInput);

    // apply transformation to materials
    let transformUniform = {type: "mat4", value:inputTransformation};
    demoScene.materials.xArrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.yArrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.zArrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.arrowMat.uniforms.transformation = transformUniform;
    demoScene.materials.lineMat.uniforms.transformation = transformUniform;

    // draw special objects
    Objects.drawGridLines(objs.grid);
    Objects.drawArrow(objs.vector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vec.x, vec.y, vec.z));
    Objects.drawArrow(objs.xComponentVector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vec.x, 0, 0));
    Objects.drawArrow(objs.zComponentVector, new THREE.Vector3(vec.x, 0, 0), new THREE.Vector3(0, 0, vec.z));
    Objects.drawArrow(objs.yComponentVector, new THREE.Vector3(vec.x, 0, vec.z), new THREE.Vector3(0, vec.y, 0));
}

// update zoom when slider is adjusted manually
zoomSlider.oninput = (e) => {
    if (e.isTrusted) {
        e.preventDefault();
        demoScene.zoom = zoomSlider.value;
    }
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

    inputTransformation = Utils.readMatrixInput4(matrixInput);
    intervalId = setInterval(progressTransformation, 1 / transformTransitionFPS);
}

// set the dimension of all the inputs
function setInputDimension(dimension) {
    Utils.setMatrixInputDimension(matrixInput, dimension);
    Utils.setVectorInputDimension(vectorInput, dimension);
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

// toggle visible component vectors
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
