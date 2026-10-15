
/* ====== SMOOTH, RESPONSIVE CURSOR ====== */

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

let mouseX = -100;
let mouseY = -100;

function moveCursor(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Reveal the grid around the mouse
    document.documentElement.style.setProperty(
        "--mouse-x",
        `${mouseX}px`
    );

    document.documentElement.style.setProperty(
        "--mouse-y",
        `${mouseY}px`
    );

    // Move the custom cursor immediately — no animation lag
    if (cursorDot) {
        cursorDot.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }

    if (cursorRing) {
        cursorRing.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
}

window.addEventListener("pointermove", moveCursor, {
    passive: true
});
