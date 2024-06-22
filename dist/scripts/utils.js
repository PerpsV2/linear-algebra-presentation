import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// get principal angle
export function getPrincipalAngle(angle) {
    return (Math.PI * 2 + (angle % Math.PI * 2)) % Math.PI * 2;
}

// clamp a value between two limits
export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// generate all binary numbers with a specified number of digits
export function generateBinaryStates(digits) {
    var states = [];
    var decimal = parseInt("1".repeat(digits), 2);
    for (let i = 0; i <= decimal; i++) {
        states.push(i.toString(2).padStart(digits, '0'));
    }
    return states;
}

// update the bounds of an orgthographic camera
export function updateOrthographicCameraSize(camera, left, right, top, bottom) {
    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;
}

export function nearlyEqual(a, b, epsilon) {
    if (a === b) return true;

    var absA = Math.abs(a);
    var absB = Math.abs(b);
    var diff = Math.abs(a - b);

    if (a == 0 || b == 0 || diff < Number.MIN_VALUE) return diff < epsilon * Number.MIN_VALUE;
    else return diff / Math.min(absA + absB, Number.MAX_VALUE) < epsilon;
}

// disable/enable some inputs of a matrix/vector to fit a certain dimension
export function setMatrixInputDimension(matrixInput, dimension) {
    var matrixInputsArray = Array.from(matrixInput.children);
    matrixInputsArray.filter((input) => input.dataset.dimension > dimension).forEach((input) => {input.disabled = true; input.value = input.dataset.default;});
    matrixInputsArray.filter((input) => input.dataset.dimension <= dimension).forEach((input) => input.disabled = false);
}

export function setVectorInputDimension(vectorInput, dimension) {
    var vectorInputsArray = Array.from(vectorInput.children);
    vectorInputsArray.filter((input) => input.dataset.dimension > dimension).forEach((input) => {input.disabled = true; input.value = input.dataset.default;});
    vectorInputsArray.filter((input) => input.dataset.dimension <= dimension).forEach((input) => input.disabled = false);
}

// create a 4x4 THREE matrix using a matrix input
export function readMatrixInput4(matrixInput) {
    var matrixInputs = matrixInput.children;
    return new THREE.Matrix4
    (matrixInputs[0].value, matrixInputs[2].value, matrixInputs[1].value, 0,
     matrixInputs[6].value, matrixInputs[8].value, matrixInputs[7].value, 0,
    -matrixInputs[3].value,-matrixInputs[5].value,-matrixInputs[4].value, 0,
     0                    , 0                    , 0                    , 1);
}

// create a 3D THREE vector using a vector input
export function readVectorInput3(vectorInput) {
    return new THREE.Vector3(vectorInput.children[0].value, vectorInput.children[2].value, vectorInput.children[1].value);
}

export function setVectorInput3(vectorInput, x, y, z) {
    vectorInput.children[0].value = x;
    vectorInput.children[2].value = y;
    vectorInput.children[1].value = z;
}

export function interpolateMatrix(startMatrix, endMatrix, alpha) {
    var startPosition = new THREE.Vector3();
    var startRotation = new THREE.Quaternion();
    var startScale = new THREE.Vector3();
    startMatrix.decompose(startPosition, startRotation, startScale);

    var endPosition = new THREE.Vector3();
    var endRotation = new THREE.Quaternion();
    var endScale = new THREE.Vector3();
    endMatrix.decompose(endPosition, endRotation, endScale);

    var lerpPosition = startPosition.lerp(endPosition, alpha);
    var lerpScale = startScale.lerp(endScale, alpha);
    var slerpRotation = startRotation.slerp(endRotation, alpha);

    return new THREE.Matrix4().compose(lerpPosition, slerpRotation, lerpScale)
}