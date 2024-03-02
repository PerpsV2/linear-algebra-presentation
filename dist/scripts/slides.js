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

document.addEventListener('DOMContentLoaded', (event) => {
    setSlide(localStorage.getItem('slide'))

    console.log("loaded");
    // populate matrix inputs and vector inputs
    for(let matrixInput of document.getElementsByTagName("x-matrix-input")) {
        let dimension = Number.parseInt(matrixInput.dataset.dimension);
        for (let i = 0; i < dimension * dimension; ++i) {
            let input = document.createElement('input');
            input.classList.add('demo-input');
            input.type = 'number';
            input.dataset.default = 0;
            if (i % (dimension + 1) === 0)
                input.dataset.default = 1;
            input.value = input.dataset.default;
            input.dataset.dimension = Math.max(i % dimension + 1, Math.floor(i / dimension) + 1);
            matrixInput.appendChild(input);
        }
    }
})

// detect for key presses
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'd') incrementSlide(1);
    if (event.key === 'ArrowLeft'  || event.key === 'a') incrementSlide(-1);
});