const fs = require("fs");
const { execSync } = require("child_process");

// Script which should be ran before deploying
// Pulls in the website, canvas_timeline and other
// resources.

if (fs.existsSync("./website")) {
    execSync("git pull", { cwd: "./website" });
} else {
    execSync("git clone -b tempMain https://github.com/bhuman-ai/website.git");
    execSync("npm i --legacy-peer-deps", { cwd: "./website" });
}

if (fs.existsSync("./src/canvas_timeline")) {
    execSync("git checkout package", { cwd: "./src/canvas_timeline" });
    execSync("git pull", { cwd: "./src/canvas_timeline" });
} else {
    execSync("git clone https://github.com/bhuman-ai/canvas_timeline.git", { cwd: "./src" });
    execSync("git checkout package", { cwd: "./src/canvas_timeline" });
    fs.unlinkSync("./src/canvas_timeline/index.html")
}
