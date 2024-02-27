import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';
import DemoScene from './demoScene.js';

// configure demo scene
var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");

var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;
demoScene.sceneObjects.vector = createArrowMesh(demoScene.scene, demoScene.materials.arrowMat, 0.04, 0.16, 0.25);

// get scene settings elements
var vectorInputs = document.getElementById("vector-input").children;

function anim() {
    Utils.drawVector(demoScene.sceneObjects.vector, new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(vectorInputs[0].value, vectorInputs[1].value, vectorInputs[2].value));
}

demoScene.animate(anim);

function setCam2D() {demoScene.setCamera2D();}
function setCam3D() {demoScene.setCamera3D();}
window.setCam2D = setCam2D;
window.setCam3D = setCam3D;