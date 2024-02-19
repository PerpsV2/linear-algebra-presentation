import * as THREE from 'https://unpkg.com/three/build/three.module.js';

function createGridMesh(material, cellSize, gridSize) {
    var lineObjects = [];
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
            lineObjects.push(createLineMesh(material, points[p], points[p + 1]));
        }
    }
    return lineObjects
}
window.createGridMesh = createGridMesh;

function createLineMesh(material, startPos, endPos) {
    let points = [new THREE.Vector3(startPos[0], startPos[1], startPos[2]), new THREE.Vector3(endPos[0], endPos[1], endPos[2])];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    return line;
}
window.createLineMesh = createLineMesh;

// create the mesh of a cube
function createCubeMesh(material, length, width, height) {
    const geometry = new THREE.BoxGeometry(length, width, height);
    const mesh = new THREE.Mesh(geometry, material)
    return mesh;
}
window.createCubeMesh = createCubeMesh;