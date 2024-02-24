import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import DemoScene from './demoScene.js';

var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");

var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6);
demoScene.mouseSensitivity = 1.7;

demoScene.addMaterial('arrowMat2').uniforms.color = {type:'vec3', value:new THREE.Vector3(0.5, 0.5, 0.5)};
demoScene.sceneObjects.vector = createArrowMesh(demoScene.scene, demoScene.materials.arrowMat2, 0.04, 0.5, 0.8);

function anim() {
    if (typeof anim.r == 'undefined') anim.r = 0;
    let red = Math.cos(++anim.r * Math.PI / 180) / 2 + 0.5;
    demoScene.materials.arrowMat2.uniforms.color = {type:'vec3', value:new THREE.Vector3(red, 0, 0)};
}

demoScene.animate(anim);

function setCam2D() {demoScene.setCamera2D();}
function setCam3D() {demoScene.setCamera3D();}
window.setCam2D = setCam2D;
window.setCam3D = setCam3D;