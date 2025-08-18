const fs = require("fs");
const path = require("path");

const soundsDir = path.join(__dirname, "../assets/sounds/Music");
const outputFile = path.join(__dirname, "../ambientSounds.ts");

// ✅ Ensure the folder exists
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`📂 Created missing folder: ${soundsDir}`);
}

// ✅ Read all mp3 files
const files = fs.readdirSync(soundsDir).filter((f) => f.endsWith(".mp3"));

if (files.length === 0) {
  console.warn("⚠️ No .mp3 files found in assets/sounds/Music/");
}

// ✅ Generate TypeScript export
const imports = files
  .map(
    (file) =>
      `  { id: "${path.basename(file, ".mp3")}", name: "${path
        .basename(file, ".mp3")
        .replace(/-/g, " ")}", file: require("./assets/sounds/Music/${file}") }`
  )
  .join(",\n");

const content = `// 🚀 Auto-generated file. Do not edit manually.
export const ambientSounds = [
${imports}
] as const;
`;

fs.writeFileSync(outputFile, content);

console.log(`✅ Generated ambientSounds.ts with ${files.length} sounds.`);
