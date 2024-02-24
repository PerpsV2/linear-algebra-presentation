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
    
    arrowObject.arrowbody.scale.x = magnitude;
    arrowObject.arrowbody.rotation.y = azimuthAngle;
    arrowObject.arrowbody.rotation.z = elevationAngle;
}