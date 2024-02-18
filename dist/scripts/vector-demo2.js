import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const displayScale = 0.6;

let demoContainer = document.getElementById("vector-demo2-container");
let demoCanvas = document.getElementById("vector-demo2-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: demoCanvas
});

renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
demoContainer.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 3, 1);
const material = new THREE.MeshBasicMaterial( {color: 0xFF00FF } );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// render loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.2;
    cube.rotation.y += 0.2;
    cube.rotation.z += 0.2;
    renderer.render(scene, camera);
}
animate();