let currentSlide = 1

function incrementSlide(incrementAmount) {
    currentSlide = Math.max(currentSlide + incrementAmount, 1);
    document.getElementById("slide-number").textContent = "#" + currentSlide;
}

function setSlide(slideNumber) {
    currentSlide = Math.max(slideNumber, 1);
    document.getElementById("slide-number").textContent = "#" + currentSlide;
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