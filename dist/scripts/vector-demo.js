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

    camera.position.z = 5;

    const basicMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    const lineMaterial = new THREE.LineBasicMaterial( {color: 0xffffff } );

    createGridMesh(lineMaterial, 1, 20);
    animate();
}

function generateBinaryStates(digits) {
    var states = [];
    var decimal = parseInt("1".repeat(digits), 2);
    for (let i = 0; i <= decimal; i++) {
        states.push(i.toString(2).padStart(digits, '0'));
    }
    return states;
}

function createGridMesh(material, cellSize, gridSize) {
    for (let d = cellSize; d <= gridSize; d += cellSize) {
        let points = []
        let states = generateBinaryStates(3);
        for(let state of states) {
            let xPos = gridSize;
            let yPos = d;

            if (!!parseInt(state[2])) xPos *= -1;
            if (!!parseInt(state[1])) yPos *= -1;
            if (!!parseInt(state[0])) [xPos, yPos] = [yPos, xPos]
            points.push([xPos, yPos, 0]);
        }
        for (let p = 0; p < points.length; p+=2) {
            createLineMesh(material, points[p], points[p + 1]);
        }
    }
}

function createLineMesh(material, startPos, endPos) {
    let points = [new THREE.Vector3(startPos[0], startPos[1], startPos[2]), new THREE.Vector3(endPos[0], endPos[1], endPos[2])];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    sceneObjects.push(line);
    scene.add(line);
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
    camera.left = frustumAspectRatio * frustumSize / -2;
    camera.right = frustumAspectRatio * frustumSize / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
init();