import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import DemoScene from './demoScene.js';

var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");

var demoScene = new DemoScene(demoCanvas, demoContainer, 0.6, 1, 20, 0.04);

function setCam2D() {demoScene.setCamera2D();}
function setCam3D() {demoScene.setCamera3D();}
window.setCam2D = setCam2D;
window.setCam3D = setCam3D;

function animate() {
    requestAnimationFrame(animate);
    if (demoScene.pCameraEnabled) demoScene.rotateCamera(0, 0);
    else updateOrthographicCameraSize(demoScene.camera, demoScene.frustumAspectRatio * demoScene.zoom / -2, 
    demoScene.frustumAspectRatio * demoScene.zoom / 2, demoScene.zoom / 2, demoScene.zoom / -2);
    demoScene.renderer.render(demoScene.scene, demoScene.camera);
}
animate();