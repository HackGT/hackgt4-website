function wait(milliseconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

async function writeText(container: HTMLElement, text: string[]) {
    await wait(500);
    for (let line of text) {
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

let showMainRun: boolean = false;
async function showMain() {
    if (showMainRun) return;
    showMainRun = true;

    document.body.classList.remove("covered");
    document.getElementsByClassName("cover")[0].classList.add("hidden");
    document.getElementsByTagName("nav")[0].classList.add("show");
    await writeText(document.getElementById("system-active")!, [
        "// HackGT System Active"
    ]);
}

window.onload = async () => {
    window.scrollTo(0, 0);
    document.body.addEventListener("keypress", showMain);
    document.body.addEventListener("click", showMain);
    
    writeText(document.getElementById("intro-text")!, [
        "Initializing......",
        "Welcome to HackGT 4: New Heights"
    ]).then(showMain);

    let sections: { [key: string]: Element } = {};
    for (let i = 0, rawSections = document.querySelectorAll("main > section"); i < rawSections.length; i++) {
        sections[rawSections[i].id] = rawSections[i];
    }
    
};
