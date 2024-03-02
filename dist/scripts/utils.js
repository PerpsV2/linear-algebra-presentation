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

function nearlyEqual(a, b, epsilon) {
    if (a === b) return true;

    var absA = Math.abs(a);
    var absB = Math.abs(b);
    var diff = Math.abs(a - b);

    if (a == 0 || b == 0 || diff < Number.MIN_VALUE) return diff < epsilon * Number.MIN_VALUE;
    else return diff / Math.min(absA + absB, Number.MAX_VALUE) < epsilon;
}

// disable/enable some inputs of a matrix/vector to fit a certain dimension
function setMatrixInputDimension(matrixInput, dimension) {
    var matrixInputsArray = Array.from(matrixInput.children);
    matrixInputsArray.filter((input) => input.dataset.dimension > dimension).forEach((input) => {input.disabled = true; input.value = input.dataset.default;});
    matrixInputsArray.filter((input) => input.dataset.dimension <= dimension).forEach((input) => input.disabled = false);
}

function setVectorInputDimension(vectorInput, dimension) {
    var vectorInputsArray = Array.from(vectorInput.children);
    vectorInputsArray.filter((input) => input.dataset.dimension > dimension).forEach((input) => {input.disabled = true; input.value = input.dataset.default;});
    vectorInputsArray.filter((input) => input.dataset.dimension <= dimension).forEach((input) => input.disabled = false);
}

// create a THREE matrix using matrix input for up to 3 dimensions
function readMatrixInput(matrixInput) {

}

export {getPrincipalAngle, clamp, generateBinaryStates, updateOrthographicCameraSize, nearlyEqual, setMatrixInputDimension, setVectorInputDimension};