let currentSlide = 1;

function incrementSlide(incrementAmount) {
    currentSlide = Math.max(currentSlide + incrementAmount, 1);
    document.getElementById("page-number").textContent = "#" + currentSlide;
}

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight") incrementSlide(1);
    if (event.key === "ArrowLeft") incrementSlide(-1);
});