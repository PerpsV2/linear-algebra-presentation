import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';

// create arrow object {arrowbody, arrowhead, arrowheadLength}
function createArrowMesh(scene, material, arrowbodyWidth, arrowheadWidth, arrowheadLength) {
    // create arrow body
    const arrowbodyGeometry = new THREE.BoxGeometry(1, arrowbodyWidth, arrowbodyWidth);
    arrowbodyGeometry.translate(0.5, 0, 0);
    const arrowbody = new THREE.Mesh(arrowbodyGeometry, material);

    // create arrow head
    const arrowheadGeometry = new THREE.CylinderGeometry(0, arrowheadWidth / 2, arrowheadLength, 4);
    arrowheadGeometry.rotateZ(-Math.PI / 2);
    const arrowhead = new THREE.Mesh(arrowheadGeometry, material);
    arrowhead.matrixAutoUpdate = false;

    scene.add(arrowbody);
    scene.add(arrowhead);
    let arrowObject = {arrowbody: arrowbody, arrowhead: arrowhead, arrowheadLength: arrowheadLength, visible: true};
    return arrowObject;
}
window.createArrowMesh = createArrowMesh;

// create grid mesh [line1, line2, line3,... ]
function createGridMesh(scene, material, cellSize, gridSize) {
    var lineObjects = [];
    for (let d = cellSize; d <= gridSize; d += cellSize) {
        let points = []
        let states = Utils.generateBinaryStates(3);
        for(let state of states) {
            let xPos = gridSize;
            let yPos = d;

            if (!!parseInt(state[2])) xPos *= -1;
            if (!!parseInt(state[1])) yPos *= -1;
            if (!!parseInt(state[0])) [xPos, yPos] = [yPos, xPos]
            points.push([xPos, 0, yPos]);
        }
        for (let p = 0; p < points.length; p+=2) {
            lineObjects.push(createLineMesh(scene, material, points[p], points[p + 1]));
        }
    }
    return lineObjects
}
window.createGridMesh = createGridMesh;

// create single line mesh
function createLineMesh(scene, material, startPos, endPos) {
    let points = [new THREE.Vector3(startPos[0], startPos[1], startPos[2]), new THREE.Vector3(endPos[0], endPos[1], endPos[2])];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return line;
}
window.createLineMesh = createLineMesh;

// create mesh of a box
function createBoxMesh(scene, material, length, width, height) {
    const geometry = new THREE.BoxGeometry(length, width, height);
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh);
    return mesh;
}
window.createBoxMesh = createBoxMesh;