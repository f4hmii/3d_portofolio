const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

const filesToCopy = [
  "index.html",
  "style.css",
  "technologies.css",
  "workflow.css",
  "initiate.css",
  "contact.css",
  "about.js",
  "technologies.js",
  "tech-logos.js",
  "keyboard-audio.js",
  "fallback.js",
  "script.js",
  "scroll-motion.js",
  "project-carousel.js",
  "workflow.js",
  "contact.js",
];

for (const file of filesToCopy) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, file));
  }
}

const dirsToCopy = ["assets", "image_asset", "vendor"];
for (const dir of dirsToCopy) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dist, dir), { recursive: true });
  }
}

console.log("Static production build ready in dist/");
