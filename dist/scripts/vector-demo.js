import * as THREE from 'https://unpkg.com/three/build/three.module.js';

var demoContainer = document.getElementById("vector-demo-container");
var demoCanvas = document.getElementById("vector-demo-canvas");
var zoomSlider = document.getElementById("zoom");

const frustumAspectRatio = demoCanvas.offsetWidth / demoCanvas.offsetHeight;
const displayScale = 0.6;
var frustumSize = 2;

var scene;
var camera;
var renderer;
var sceneObjects = [];

// initialize scene, camera, renderer and all the objects which will be rendered
function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(frustumAspectRatio * frustumSize / -2, frustumAspectRatio * frustumSize / 2, 
    frustumSize / 2, frustumSize / -2, 0.1, 1000);
    renderer = new THREE.WebGLRenderer( {canvas: demoCanvas} );
    renderer.setClearColor(0x252525, 1);
    renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
    demoContainer.appendChild(renderer.domElement);

    const basicMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    const greenMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00 } );

    camera.position.z = 5;

    createCubeMesh(basicMaterial, 1, 1, 1);
    createCubeMesh(greenMaterial, 1, 2, 0.5);
    animate();
}

// create the mesh of a cube
function createCubeMesh(material, length, width, height) {
    const geometry = new THREE.BoxGeometry(length, width, height);
    const mesh = new THREE.Mesh(geometry, material)
    sceneObjects.push(mesh);
    scene.add(mesh);
}

// render loop
function animate() {
    requestAnimationFrame(animate);
    frustumSize = zoomSlider.value;
    console.log(frustumSize);
    camera.left = frustumAspectRatio * frustumSize / -2;
    camera.right = frustumAspectRatio * frustumSize / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
init();