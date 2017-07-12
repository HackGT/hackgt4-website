function wait(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

async function writeIntroText() {
    const introTextContainer = document.getElementById("intro-text");
    await wait(500);

    const introText = [
        "Initializing......",
        "Well, here we are."
    ];
    for (let line of introText) {
        introTextContainer.textContent = "";
        for (let char of line) {
            introTextContainer.textContent += char;
            let waitTime = Math.random() * 20 + 100;
            if ([",", ".", "!", "?", "\n"].indexOf(char) !== -1) {
                waitTime *= 3;
            }
            await wait(waitTime);
        }
        introTextContainer.classList.add("idle");
        await wait(1000);
        introTextContainer.classList.remove("idle");
    }
    introTextContainer.classList.add("idle");
}

window.onload = async () => {
    "use strict";
    
    writeIntroText();

    document.body.addEventListener("keypress", (event) => {
        let height = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0);
        if (window.scrollY < height / 2) {
            jump('.event-info');
        }
    });
};

