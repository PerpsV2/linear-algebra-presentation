var currentSlide = 1;

document.createElement('flex-container');
document.createElement('x-highlight');
document.createElement('x-vector-input');
document.createElement('x-matrix-input');

function incrementSlide(incrementAmount) {
    setSlide(currentSlide + incrementAmount);
}

function setSlideVisibilities(slides) {
    slides[currentSlide - 1].classList.remove('before-shown');
    slides[currentSlide - 1].classList.remove('after-shown');
    for (let i = 0; i < currentSlide - 1; i++) {
        slideClassList = slides[i].classList;
        slideClassList.remove('before-shown');
        slideClassList.add('after-shown');
    }
    for (let i = currentSlide; i < slides.length; i++) {
        slideClassList = slides[i].classList;
        slideClassList.remove('after-shown');
        slideClassList.add('before-shown');
    }
}

function setSlide(slideNumber) {
    var backButton = document.getElementById('back-button');
    var forwardButton = document.getElementById('forward-button');
    var slides = document.getElementsByClassName('slide');
    var lastSlide = slides.length;

    currentSlide = Math.min(Math.max(slideNumber, 1), lastSlide);
    document.getElementById('slide-number').textContent = '#' + currentSlide;
    document.documentElement.style.setProperty('--progress-bar-progress', '' + (currentSlide - 1) / (lastSlide - 1) * 100);
    setSlideVisibilities(slides);
    
    backButton.disabled = false;
    forwardButton.disabled = false;
    // disable the back button on the first slide...
    if (currentSlide <= 1) {
        backButton.disabled = true;
    }
    // and disable the front button on the last slide
    if (currentSlide >= lastSlide) {
        forwardButton.disabled = true;
    }
}

function changeSection(pageName, slideNumber = 1) {
    var path = window.location.pathname;
    var page = path.split('/').pop();
    if (pageName + '.html' == page) {
        setSlide(slideNumber);
        return;
    }
    localStorage.setItem('slide', slideNumber);
    window.location.href = pageName + '.html';
}

function createDemoNumberInput(defaultValue, dimension) {
    var input = document.createElement('input');
    input.type = 'number';
    input.classList.add('demo-input');
    input.dataset.default = defaultValue;
    input.dataset.dimension = Math.max(i % dimension + 1, Math.floor(i / dimension) + 1);
    input.value = input.dataset.default;
    return input;
}

document.addEventListener('DOMContentLoaded', (event) => {
    setSlide(localStorage.getItem('slide'))

    console.log("loaded");
    // populate matrix inputs and vector inputs
    for(let matrixInput of document.getElementsByTagName('x-matrix-input')) {
        let dimension = Number.parseInt(matrixInput.dataset.dimension);
        for (let i = 0; i < dimension * dimension; ++i) {
            matrixInput.appendChild(createDemoNumberInput(i % (dimension + 1) === 0 ? 1 : 0, Math.max(i % dimension + 1, Math.floor(i / dimension) + 1)));
        }
    }

    for (let vectorInput of document.getElementsByTagName('x-vector-input')) {
        let dimension = Number.parseInt(vectorInput.dataset.dimension);
        for (let i = 0; i < dimension; ++i) {
            vectorInput.appendChild(createDemoNumberInput(i <= 2 ? 1 : 0, i));
        }
    }
})

// detect for key presses
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'd') incrementSlide(1);
    if (event.key === 'ArrowLeft'  || event.key === 'a') incrementSlide(-1);
});