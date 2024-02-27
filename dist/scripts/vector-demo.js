import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';
import DemoScene from './demoScene.js';

// constants
const arrowbodyWidth = 0.04;
const arrowheadWidth = 0.16;
const arrowheadLength = 0.25;

// settings
var showComponentVectors = true;

// configure demo scene
var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");

var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;
var objs = demoScene.sceneObjects;
objs.vector = createArrowMesh(demoScene.scene, demoScene.materials.arrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);

// create component vectors...
var xArrowMat = demoScene.addMaterial("xArrowMat");
xArrowMat.uniforms.color = {type: 'vec3', value: new THREE.Vector3(1.0, 0.0, 0.0)};

var yArrowMat = demoScene.addMaterial("yArrowMat");
yArrowMat.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.0, 0.0, 1.0)};

var zArrowMat = demoScene.addMaterial("zArrowMat");
zArrowMat.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.0, 1.0, 0.0)};

objs.xComponentVector = createArrowMesh(demoScene.scene, demoScene.materials.xArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.yComponentVector = createArrowMesh(demoScene.scene, demoScene.materials.yArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
objs.zComponentVector = createArrowMesh(demoScene.scene, demoScene.materials.zArrowMat, arrowbodyWidth, arrowheadWidth, arrowheadLength);
toggleComponentVectors(); // and hide them to start with

// get scene settings elements
var vectorInputs = document.getElementById("vector-input").children;

function anim() {
    let vecX = vectorInputs[0].value;
    let vecY = vectorInputs[1].value;
    let vecZ = vectorInputs[2].value;

    Utils.drawVector(objs.vector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vecX, vecY, vecZ));

    Utils.drawVector(objs.xComponentVector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(vecX, 0, 0));
    Utils.drawVector(objs.zComponentVector, new THREE.Vector3(vecX, 0, 0), new THREE.Vector3(0, 0, vecZ));
    Utils.drawVector(objs.yComponentVector, new THREE.Vector3(vecX, 0, -vecZ), new THREE.Vector3(0, vecY, 0));
}

demoScene.animate(anim);

function setCam2D() {demoScene.setCamera2D();}
function setCam3D() {demoScene.setCamera3D();}
window.setCam2D = setCam2D;
window.setCam3D = setCam3D;

function toggleComponentVectors() {
    showComponentVectors = !showComponentVectors;
    Utils.setArrowVisiblity(objs.xComponentVector, showComponentVectors);
    Utils.setArrowVisiblity(objs.yComponentVector, showComponentVectors);
    Utils.setArrowVisiblity(objs.zComponentVector, showComponentVectors);
}
window.toggleComponentVectors = toggleComponentVectors;