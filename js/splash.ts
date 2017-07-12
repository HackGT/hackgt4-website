declare const moment: any;

function wait(milliseconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

let writeTextRunning: boolean = false;
async function writeText(container: HTMLElement, text: string[], lineWaitTime: number = 1000) {
    if (writeTextRunning) return;
    writeTextRunning = true;
    await wait(500);
    container.classList.remove("idle");
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
        await wait(lineWaitTime);
        container.classList.remove("idle");
    }
    container.classList.add("idle");
    await wait(500);
    writeTextRunning = false;
}

let showMainRun: boolean = false;
async function showMain() {
    if (showMainRun) return;
    showMainRun = true;
    writeTextRunning = false;

    document.body.classList.remove("covered");
    document.getElementsByClassName("cover")[0].classList.add("hidden");
    document.getElementsByTagName("nav")[0].classList.add("show");
    await writeText(document.getElementById("system-active")!, [
        "// HackGT System Active"
    ]);

    // Show countdown
    document.getElementById("system-active")!.classList.add("hide-cursor");
    const countdown = document.getElementById("countdown")!;
    countdown.classList.remove("hidden");
    let interval = 0;
    while (true) {
        if (interval % 2 === 0) {
            writeText(countdown, ["October 13–15, 2017"]);
            console.log(Date.now());
        }
        else {
            writeText(countdown, [generateCountdownText()]);
            console.log(Date.now());
        }
        interval++;
        await wait(8000);
    }
}

function generateCountdownText(): string {
    const date = moment("2017-10-13");
    let days = date.diff(moment(), "days");
    if (days < 0) {
        return "Thanks for coming!";
    }
    return `${days} day${days === 1 ? "" : "s"} remaining`;
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
    for (let i = 0, rawTabs = document.querySelectorAll("nav > .item"); i < rawTabs.length; i++) {
        rawTabs[i].addEventListener("click", () => {
            let target = document.getElementById((rawTabs[i] as HTMLElement).dataset.href!);
            if (!target) {
                console.warn(`${(rawTabs[i] as HTMLElement).dataset.href} doesn't exist`);
                return;
            }
            for (let sectionID in sections) {
                sections[sectionID].classList.add("hidden");
            }
            target.classList.remove("hidden");
            for (let j = 0; j < rawTabs.length; j++) {
                rawTabs[j].classList.remove("active");
            }
            rawTabs[i].classList.add("active");
        });
    }
};
