function generateBinaryStates(digits) {
    var states = [];
    var decimal = parseInt("1".repeat(digits), 2);
    for (let i = 0; i <= decimal; i++) {
        states.push(i.toString(2).padStart(digits, '0'));
    }
    return states;
}