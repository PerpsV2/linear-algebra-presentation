var currentSlide = 1;

document.createElement('flex-container');
document.createElement('x-hl');
document.createElement('x-vector-input');
document.createElement('x-matrix-input');

function incrementSlide(incrementAmount) {
    setSlide(currentSlide + incrementAmount);
}

function setSlideVisibilities(slides) {
    for (let i = 0; i < slides.length; ++i) {
        let slideClassList = slides[i].classList;
        slideClassList.remove('after-shown');
        slideClassList.remove('before-shown');
        if (i < currentSlide - 1) slideClassList.add('after-shown');
        if (i > currentSlide - 1) slideClassList.add('before-shown');
    }
}

function setSlide(slideNumber) {
    var backButton = document.getElementById('back-button');
    var forwardButton = document.getElementById('forward-button');
    var slides = document.getElementsByClassName('slide');
    var lastSlideNumber = slides.length;

    currentSlide = Math.min(Math.max(slideNumber, 1), lastSlideNumber);
    document.getElementById('slide-number').textContent = '#' + currentSlide;
    document.documentElement.style.setProperty('--progress-bar-progress', '' + (currentSlide - 1) / (lastSlideNumber - 1) * 100);
    setSlideVisibilities(slides);

    backButton.disabled = currentSlide <= 1;
    forwardButton.disabled = currentSlide >= lastSlideNumber;
}

function setPage(pageName, slideNumber = 1) {
    localStorage.setItem('slide', slideNumber);
    window.location.href = pageName + '.html';
}

function createDemoNumberInput(defaultValue, dimension) {
    var input = document.createElement('input');
    input.type = 'number';
    input.classList.add('demo-input');
    input.dataset.default = defaultValue;
    input.dataset.dimension = dimension;
    input.value = input.dataset.default;
    return input;
}

document.addEventListener('DOMContentLoaded', (e) => {
    setSlide(localStorage.getItem('slide'))

    // populate matrix inputs and vector inputs
    for(let matrixInput of document.getElementsByTagName('x-matrix-input')) {
        let dimension = Number.parseInt(matrixInput.dataset.dimension);
        for (let i = 0; i < dimension * dimension; ++i)
            matrixInput.appendChild(createDemoNumberInput(i % (dimension + 1) === 0 ? 1 : 0, Math.max(i % dimension + 1, Math.floor(i / dimension) + 1)));
    }

    for (let vectorInput of document.getElementsByTagName('x-vector-input')) {
        let dimension = Number.parseInt(vectorInput.dataset.dimension);
        for (let i = 0; i < dimension; ++i)
            vectorInput.appendChild(createDemoNumberInput(i <= 1 ? 1 : 0, i + 1));
    }
})

// detect for key presses
document.addEventListener('keydown', (e) => {
    // only register key presses if an input box is not selected
    if (document.activeElement.nodeName != 'INPUT') {
        if (e.key === 'ArrowRight' || e.key === 'd') incrementSlide(1);
        if (e.key === 'ArrowLeft'  || e.key === 'a') incrementSlide(-1);
    }
});