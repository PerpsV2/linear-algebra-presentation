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

export {getPrincipalAngle, clamp, generateBinaryStates, updateOrthographicCameraSize, nearlyEqual};