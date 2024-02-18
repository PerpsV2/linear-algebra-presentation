import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const displayScale = 0.6;

let demoContainer = document.getElementById("vector-demo-container");
let demoCanvas = document.getElementById("vector-demo-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: demoCanvas
});

renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
demoContainer.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF } );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let xRotationSlider = document.getElementById("x-rotation-slider");
let yRotationSlider = document.getElementById("y-rotation-slider");
let zRotationSlider = document.getElementById("z-rotation-slider");

// render loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += parseFloat(xRotationSlider.value);
    cube.rotation.y += parseFloat(yRotationSlider.value);
    cube.rotation.z += parseFloat(zRotationSlider.value);
    renderer.render(scene, camera);
}
animate();