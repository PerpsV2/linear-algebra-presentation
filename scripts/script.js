let currentSlide = 1

function incrementSlide(incrementAmount) {
    setSlide(currentSlide + incrementAmount);
}

function setSlide(slideNumber) {
    let backButton = document.getElementById("back-button");
    let forwardButton = document.getElementById("forward-button");
    let lastSlide = document.getElementsByClassName("slide").length

    currentSlide = Math.min(Math.max(slideNumber, 1), lastSlide);
    document.getElementById("slide-number").textContent = "#" + currentSlide;
    document.documentElement.style.setProperty("--progress-bar-progress", '' + (currentSlide - 1) / (lastSlide - 1) * 100)
    
    // disable the back button on the first slide...
    if (currentSlide <= 1) {
        backButton.disabled = true;
    }
    // and disable the front button on the last slide
    else if (currentSlide >= lastSlide) {
        forwardButton.disabled = true;
    } 
    else {
        backButton.disabled = false;
        forwardButton.disabled = false;
    }
}

function changeSection(pageName, slideNumber = 1) {
    localStorage.setItem("slide", slideNumber);
    window.location.href = "html/" + pageName + ".html";
}

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("Setting current slide to " + localStorage.getItem("slide"));
    setSlide(localStorage.getItem("slide"))
})

// detect for key presses
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" || event.key === 'd') incrementSlide(1);
    if (event.key === "ArrowLeft"  || event.key === 'a') incrementSlide(-1);
});