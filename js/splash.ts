function wait(milliseconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

async function writeText(container: HTMLElement) {
    await wait(500);

    const introText = [
        "Initializing......",
        "Welcome to HackGT: New Heights"
    ];
    for (let line of introText) {
        container.textContent = "";
        for (let char of line) {
            container.textContent += char;
            let waitTime = Math.random() * 20 + 100;
            if ([",", ".", "!", "?", "\n"].indexOf(char) !== -1) {
                waitTime *= 3;
            }
            await wait(waitTime);
        }
        container.classList.add("idle");
        await wait(1000);
        container.classList.remove("idle");
    }
    container.classList.add("idle");
    await wait(500);
}

window.onload = async () => {
    "use strict";
    
    document.body.addEventListener("keypress", (event) => {
        document.getElementsByClassName("cover")[0].classList.add("hidden");
    });
    
    await writeText(document.getElementById("intro-text")!);
    document.getElementsByClassName("cover")[0].classList.add("hidden");
};
