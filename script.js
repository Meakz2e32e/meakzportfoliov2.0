
/* ==========================================
   MEAKZ | DEVELOPER PORTFOLIO
   INTERACTION SYSTEM v1.0
========================================== */


/* ====== CONFIGURATION ====== */

const CONFIG = {
    bootDuration: 1800,
    cursorSpeed: 0.18,
    terminalName: "MEAKZ TERMINAL"
};


/* ====== ELEMENTS ====== */

const bootScreen = document.getElementById("boot-screen");
const bootProgress = document.getElementById("boot-progress");
const bootStatus = document.getElementById("boot-status");

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

const terminalForm = document.getElementById("terminal-form");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");


/* ====== SYSTEM STATE ====== */

const SYSTEM = {
    booted: false,
    commandsRun: 0,
    easterEggFound: false,
    history: [],
    historyIndex: 0
};


/* ==========================================
   01. BOOT SEQUENCE
========================================== */

function startBootSequence() {
    if (!bootScreen || !bootProgress || !bootStatus) {
        SYSTEM.booted = true;
        return;
    }

    const messages = [
        "Loading portfolio...",
        "Initialising interface...",
        "Connecting visual systems...",
        "Preparing terminal...",
        "MEAKZ SYSTEM ONLINE."
    ];

    const startTime = performance.now();

    function updateBoot(now) {
        const elapsed = now - startTime;
        const progress = Math.min(
            elapsed / CONFIG.bootDuration,
            1
        );

        const percentage = Math.round(progress * 100);

        bootProgress.style.width = percentage + "%";

        const messageIndex = Math.min(
            Math.floor(progress * messages.length),
            messages.length - 1
        );

        bootStatus.textContent = messages[messageIndex];

        if (progress < 1) {
            requestAnimationFrame(updateBoot);
        } else {
            SYSTEM.booted = true;

            setTimeout(() => {
                bootScreen.classList.add("hidden");
            }, 350);
        }
    }

    requestAnimationFrame(updateBoot);
}


/* ==========================================
   02. CUSTOM CROSSHAIR
========================================== */

function initialiseCursor() {
    if (!cursorDot || !cursorRing) return;

    // Custom cursor is for mouse devices only.
    if (window.matchMedia("(pointer: fine)").matches) {
        document.body.classList.add("custom-cursor");
    } else {
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.transform =
            `translate3d(${mouseX - 2.5}px, ${mouseY - 2.5}px, 0)`;
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * CONFIG.cursorSpeed;
        ringY += (mouseY - ringY) * CONFIG.cursorSpeed;

        cursorRing.style.transform =
            `translate3d(${ringX - 15}px, ${ringY - 15}px, 0)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Enlarge the crosshair over interactive elements.
    const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, [role='button']"
    );

    interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursorRing.classList.add("cursor-hover");
        });

        element.addEventListener("mouseleave", () => {
            cursorRing.classList.remove("cursor-hover");
        });
    });

    // Hide cursor effects when leaving the page.
    document.addEventListener("mouseleave", () => {
        cursorDot.style.opacity = "0";
        cursorRing.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        cursorDot.style.opacity = "1";
        cursorRing.style.opacity = "1";
    });
}


/* ==========================================
   03. LIVE CLOCK
========================================== */

function createLiveClock() {
    const clock = document.createElement("span");

    clock.id = "system-clock";
    clock.style.cssText = `
        color: #c084fc;
        font-family: Consolas, monospace;
        font-size: 10px;
        letter-spacing: 1px;
    `;

    const navbar = document.querySelector(".nav-status");

    if (navbar) {
        navbar.appendChild(clock);
    }

    function updateClock() {
        const now = new Date();

        clock.textContent = now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
}


/* ==========================================
   04. TERMINAL OUTPUT
========================================== */

function terminalPrint(message, className = "") {
    if (!terminalOutput) return;

    const line = document.createElement("p");

    if (className) {
        line.className = className;
    }

    // textContent prevents terminal input being interpreted as HTML.
    line.textContent = message;

    terminalOutput.appendChild(line);

    // Keep the terminal scrolled to the latest output.
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // Keep the output from growing forever.
    while (terminalOutput.children.length > 100) {
        terminalOutput.removeChild(terminalOutput.firstChild);
    }
}


function terminalDivider() {
    terminalPrint("----------------------------------------");
}


/* ==========================================
   05. TERMINAL COMMANDS
========================================== */

function runCommand(rawCommand) {
    const command = rawCommand.trim();
    const normalised = command.toLowerCase();

    if (!command) return;

    SYSTEM.commandsRun++;

    terminalPrint(`visitor@meakz:~$ ${command}`);

    const args = normalised.split(/\s+/);
    const mainCommand = args[0];

    switch (mainCommand) {

        case "help":
            terminalPrint("AVAILABLE COMMANDS:");
            terminalPrint("help       - Show available commands");
            terminalPrint("about      - About the developer");
            terminalPrint("projects   - List portfolio projects");
            terminalPrint("skills     - Show current toolkit");
            terminalPrint("status     - Show portfolio status");
            terminalPrint("time       - Display local time");
            terminalPrint("github     - Open GitHub");
            terminalPrint("clear      - Clear terminal");
            terminalPrint("whoami     - Identify this session");
            terminalPrint("secret     - Try to discover something");
            break;


        case "about":
            terminalPrint("MEAKZ // INDEPENDENT DEVELOPER");
            terminalPrint("Learning programming and building projects.");
            terminalPrint("Current focus: Python, C#, and web development.");
            break;


        case "projects":
            terminalPrint("PROJECT DIRECTORY:");
            terminalPrint("[001] Fishing Intelligence");
            terminalPrint("[002] Traffic Systems");
            terminalPrint("[003] System Utilities");
            terminalPrint("Explore the Projects section for details.");
            break;


        case "skills":
            terminalPrint("CURRENT TOOLKIT:");
            terminalPrint("Python       [LEARNING]");
            terminalPrint("C#           [LEARNING]");
            terminalPrint("HTML / CSS   [BUILDING]");
            terminalPrint("JavaScript   [BUILDING]");
            break;


        case "status":
            terminalPrint("PORTFOLIO STATUS: ONLINE");
            terminalPrint("INTERFACE: OPERATIONAL");
            terminalPrint("TERMINAL: READY");
            terminalPrint(`COMMANDS EXECUTED: ${SYSTEM.commandsRun}`);
            break;


        case "time":
            terminalPrint(
                "LOCAL TIME: " +
                new Date().toLocaleTimeString("en-GB")
            );
            terminalPrint(
                "DATE: " +
                new Date().toLocaleDateString("en-GB")
            );
            break;


        case "github":
            terminalPrint("Opening GitHub...");
            window.open(
                "https://github.com/",
                "_blank",
                "noopener,noreferrer"
            );
            break;


        case "whoami":
            terminalPrint("USER: PORTFOLIO VISITOR");
            terminalPrint("ACCESS: PUBLIC");
            terminalPrint("PERMISSIONS: READ ONLY");
            break;


        case "secret":
            SYSTEM.easterEggFound = true;

            terminalPrint("...");
            terminalPrint("YOU FOUND THE HIDDEN COMMAND.");
            terminalPrint("MEAKZ // KEEP BUILDING.");
            terminalPrint("ACHIEVEMENT UNLOCKED: CURIOUS.");
            document.body.classList.add("secret-mode");
            break;


        case "clear":
            terminalOutput.replaceChildren();
            return;


        case "sudo":
            terminalPrint("Nice try. This is a portfolio, not a server.");
            break;


        case "exit":
            terminalPrint("There is nowhere to escape. You're on a website.");
            break;


        default:
            terminalPrint(`Unknown command: ${command}`);
            terminalPrint("Type 'help' to see available commands.");
            break;
    }

    terminalDivider();
}


/* ==========================================
   06. TERMINAL FORM + HISTORY
========================================== */

function initialiseTerminal() {
    if (!terminalForm || !terminalInput || !terminalOutput) {
        return;
    }

    terminalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const command = terminalInput.value.trim();

        if (!command) return;

        SYSTEM.history.push(command);
        SYSTEM.historyIndex = SYSTEM.history.length;

        runCommand(command);

        terminalInput.value = "";
    });

    terminalInput.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (SYSTEM.historyIndex > 0) {
                SYSTEM.historyIndex--;

                terminalInput.value =
                    SYSTEM.history[SYSTEM.historyIndex];
            }
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (SYSTEM.historyIndex < SYSTEM.history.length - 1) {
                SYSTEM.historyIndex++;

                terminalInput.value =
                    SYSTEM.history[SYSTEM.historyIndex];
            } else {
                SYSTEM.historyIndex = SYSTEM.history.length;
                terminalInput.value = "";
            }
        }
    });
}


/* ==========================================
   07. SCROLL REVEALS
========================================== */

function initialiseRevealAnimations() {
    const sections = document.querySelectorAll(
        ".content-section"
    );

    sections.forEach((section) => {
        section.classList.add("reveal");
    });

    if (!("IntersectionObserver" in window)) {
        sections.forEach((section) => {
            section.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}


/* ==========================================
   08. PROJECT CARD EFFECTS
========================================== */

function initialiseProjectEffects() {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(168, 85, 247, 0.12),
                    rgba(12, 12, 19, 0.96) 65%
                )
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.background = "";
        });
    });
}


/* ==========================================
   09. SECRET EASTER EGG
========================================== */

function initialiseEasterEgg() {
    let typedSequence = "";

    const secretSequence = "meakz";

    document.addEventListener("keydown", (event) => {
        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement
        ) {
            return;
        }

        if (event.key.length !== 1) return;

        typedSequence += event.key.toLowerCase();

        typedSequence = typedSequence.slice(
            -secretSequence.length
        );

        if (typedSequence === secretSequence) {
            SYSTEM.easterEggFound = true;

            document.body.classList.toggle("secret-mode");

            console.log(
                "%c MEAKZ // SECRET MODE ACTIVATED ",
                "background:#6d28d9;color:white;padding:8px;font-size:14px"
            );

            typedSequence = "";
        }
    });
}


/* ==========================================
   10. CONSOLE SIGNATURE
========================================== */

function printConsoleSignature() {
    console.log(
        "%c MEAKZ ",
        "background:#7e22ce;color:white;font-size:24px;font-weight:bold;padding:8px 16px;"
    );

    console.log(
        "%c Building. Learning. Evolving.",
        "color:#c084fc;font-size:13px;"
    );

    console.log(
        "Portfolio system initialised."
    );
}


/* ==========================================
   INITIALISE EVERYTHING
========================================== */

function initialisePortfolio() {
    startBootSequence();
    initialiseCursor();
    createLiveClock();
    initialiseTerminal();
    initialiseRevealAnimations();
    initialiseProjectEffects();
    initialiseEasterEgg();
    printConsoleSignature();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialisePortfolio,
        { once: true }
    );
} else {
    initialisePortfolio();
}
