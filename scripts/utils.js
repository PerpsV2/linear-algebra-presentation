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
function drawArrow(arrowObject, startPos, endPos) {

}