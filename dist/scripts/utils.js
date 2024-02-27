import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// get principal angle
function getPrincipalAngle(angle) {
    return (Math.PI * 2 + (angle % Math.PI * 2)) % Math.PI * 2;
}

// clamp a value between two limits
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// generate all binary numbers with a specified number of digits
function generateBinaryStates(digits) {
    var states = [];
    var decimal = parseInt("1".repeat(digits), 2);
    for (let i = 0; i <= decimal; i++) {
        states.push(i.toString(2).padStart(digits, '0'));
    }
    return states;
}

// update the bounds of an orgthographic camera
function updateOrthographicCameraSize(camera, left, right, top, bottom) {
    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;
}

// draw an arrow mesh with a starting and end point
function drawVector(arrowObject, startPos, vector) {
    var azimuthAngle = Math.atan2(vector.z, vector.x);
    var elevationAngle = Math.atan2(vector.y, Math.sqrt(vector.z ** 2 + vector.x ** 2));
    var magnitude = vector.length();
    
    // position arrow body
    arrowObject.arrowbody.scale.x = Math.max(magnitude - arrowObject.arrowheadLength, 0);
    arrowObject.arrowbody.rotation.y = azimuthAngle;
    arrowObject.arrowbody.rotation.z = elevationAngle;
    arrowObject.arrowbody.position.x = startPos.x;
    arrowObject.arrowbody.position.y = startPos.y;
    arrowObject.arrowbody.position.z = startPos.z;

    // position arrow head
    var transformationMatrix = new THREE.Matrix4().identity();
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeTranslation(startPos));
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, azimuthAngle, elevationAngle, 'XYZ')));
    transformationMatrix = transformationMatrix.multiply(new THREE.Matrix4().makeTranslation(new THREE.Vector3(Math.max(magnitude - arrowObject.arrowheadLength / 2, 0), 0, 0)));
    arrowObject.arrowhead.matrix = transformationMatrix;
}

function setArrowVisiblity(arrowObject, visibility) {
    arrowObject.arrowbody.visible = visibility;
    arrowObject.arrowhead.visible = visibility;
}

export {getPrincipalAngle, clamp, generateBinaryStates, updateOrthographicCameraSize, drawVector, setArrowVisiblity};