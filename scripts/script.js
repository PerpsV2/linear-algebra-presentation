let currentSlide = 1;

function incrementSlide(incrementAmount) {
    setSlide(currentSlide + incrementAmount);
}

function setSlideVisibilities(slides) {
    slides[currentSlide - 1].classList.remove("before-shown");
    slides[currentSlide - 1].classList.remove("after-shown");
    for (let i = 0; i < currentSlide - 1; i++) {
        slideClassList = slides[i].classList;
        slideClassList.remove("before-shown");
        slideClassList.add("after-shown");
    }
    for (let i = currentSlide; i < slides.length; i++) {
        slideClassList = slides[i].classList;
        slideClassList.remove("after-shown");
        slideClassList.add("before-shown");
    }
}

function setSlide(slideNumber) {
    let backButton = document.getElementById("back-button");
    let forwardButton = document.getElementById("forward-button");
    let slides = document.getElementsByClassName("slide");
    let lastSlide = slides.length;

    currentSlide = Math.min(Math.max(slideNumber, 1), lastSlide);
    document.getElementById("slide-number").textContent = "#" + currentSlide;
    document.documentElement.style.setProperty("--progress-bar-progress", '' + (currentSlide - 1) / (lastSlide - 1) * 100);
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
    let path = window.location.pathname;
    let page = path.split('/').pop();
    if (pageName + ".html" == page) {
        setSlide(slideNumber);
        return;
    }
    localStorage.setItem("slide", slideNumber);
    if (window.location.pathname.includes("html/")) {
        window.location.href = pageName + ".html"
        return;
    }
    window.location.href = "html/" + pageName + ".html";
}

document.addEventListener("DOMContentLoaded", (event) => {
    setSlide(localStorage.getItem("slide"))
})

// detect for key presses
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" || event.key === 'd') incrementSlide(1);
    if (event.key === "ArrowLeft"  || event.key === 'a') incrementSlide(-1);
});