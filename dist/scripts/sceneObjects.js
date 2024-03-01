import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';

// create arrow object {arrowbody, arrowhead, arrowheadLength}
function createArrowMesh(scene, material, arrowbodyWidth, arrowheadWidth, arrowheadLength) {
    // create arrow body
    const arrowbodyGeometry = new THREE.BoxGeometry(1, arrowbodyWidth, arrowbodyWidth);
    arrowbodyGeometry.translate(0.5, 0, 0);
    const arrowbody = new THREE.Mesh(arrowbodyGeometry, material);
    arrowbody.matrixAutoUpdate = false;

    // create arrow head
    const arrowheadGeometry = new THREE.CylinderGeometry(0, arrowheadWidth / 2, arrowheadLength, 4);
    arrowheadGeometry.rotateZ(-Math.PI / 2);
    const arrowhead = new THREE.Mesh(arrowheadGeometry, material);
    arrowhead.matrixAutoUpdate = false;

    scene.add(arrowbody);
    scene.add(arrowhead);
    let arrowObject = {
        arrowbody: arrowbody, 
        arrowhead: arrowhead, 
        material: material,
        arrowheadLength: arrowheadLength, 
        visible: true};
    return arrowObject;
}

// draw an arrow mesh with a starting and end point
function drawArrow(arrowObject, s, v) {
    var materialMatrix = arrowObject.material.uniforms.transformation.value;
    var startPos = s.applyMatrix4(materialMatrix);
    var vector = v.applyMatrix4(materialMatrix);

    var magnitude = vector.length();
    var azimuthAngle = Math.atan2(vector.z, vector.x);
    var elevationAngle = Math.atan2(vector.y, Math.sqrt(vector.z ** 2 + vector.x ** 2));
    var scaleFactor = Math.max(magnitude - arrowObject.arrowheadLength, 0);

    // position arrow body
    var transformationMatrix = new THREE.Matrix4().identity();
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeTranslation(startPos.x, startPos.y, startPos.z));
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, -azimuthAngle, elevationAngle, 'XYZ')));
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeScale(scaleFactor, 1, 1));
    arrowObject.arrowbody.matrix = transformationMatrix;

    // position arrow head
    var transformationMatrix = new THREE.Matrix4().identity();
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeTranslation(startPos.x, startPos.y, startPos.z));
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, -azimuthAngle, elevationAngle, 'XYZ')));
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeTranslation(new THREE.Vector3(Math.max(magnitude - arrowObject.arrowheadLength / 2, 0), 0, 0)));
    arrowObject.arrowhead.matrix = transformationMatrix;

    if (magnitude <= 0 || arrowObject.visible == false){ 
        arrowObject.arrowhead.visible = false;
        arrowObject.arrowbody.visible = false;
    } else {
        arrowObject.arrowhead.visible = true;
        arrowObject.arrowbody.visible = true;
    }
}

function setArrowVisiblity(arrowObject, visibility) {
    arrowObject.visible = visibility;
    arrowObject.arrowbody.visible = visibility;
    arrowObject.arrowhead.visible = visibility;
}

// create grid mesh [line1, line2, line3,... ]
function createGridMesh(scene, material, cellSize, gridSize) {
    var lineObjects = [];
    for (let d = 0; d <= gridSize; d += cellSize) {
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

function drawGridLines(gridLines) {
    for (let line of gridLines) {
        var transformationMatrix = line.material.uniforms.transformation.value;
        line.matrix = transformationMatrix;
    }
}

// create single line mesh
function createLineMesh(scene, material, startPos, endPos) {
    let points = [new THREE.Vector3(startPos[0], startPos[1], startPos[2]), new THREE.Vector3(endPos[0], endPos[1], endPos[2])];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.matrixAutoUpdate = false;
    scene.add(line);
    return line;
}

// create mesh of a box
function createBoxMesh(scene, material, length, width, height) {
    const geometry = new THREE.BoxGeometry(length, width, height);
    const box = new THREE.Mesh(geometry, material)
    box.matrixAutoUpdate = false;
    scene.add(box);
    return box;
}

export {createArrowMesh, createGridMesh, createLineMesh, createBoxMesh, drawArrow, drawGridLines, setArrowVisiblity};