const fs = require("fs");
const path = require("path");

let sum = 0;
const rootDirectoryPath = process.argv[2] || "app/components/visualizers"; // Configurable directory path

// Function to get all .d.ts files from a directory, including subdirectories
function getDtsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getDtsFiles(filePath)); // Recursively search in subdirectories
    } else if (file.endsWith(".d.ts")) {
      results.push(filePath); // Add .d.ts file to results
    }
  });

  return results;
}

// Function to read and concatenate .d.ts file contents
function concatenateDtsFiles(filePaths) {
  sum = 0;

  filePaths.forEach(filePath => {
    const content = fs.readFileSync(filePath, "utf8");
    sum += content.length;
  });

  let msg = [];

  const concatenatedContent = filePaths.reduce((acc, filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    const name = path.basename(filePath);

    msg.push([content.length, `${((content.length / sum) * 100).toFixed(2)}% -> ${name}`]);
    return acc + "\n" + content; // Concatenate with newline separator
  }, "");

  console.log(
    msg
      .sort((a, b) => b[0] - a[0]) // Sort by file size in descending order
      .map(([size, msg]) => `${msg} (${size} bytes)`)
      .join("\n")
  );

  return concatenatedContent;
}

// Main function to process .d.ts files and save as a .json
function processDtsFiles() {
  try {
    const dtsFiles = getDtsFiles(rootDirectoryPath);
    const concatenatedContent = concatenateDtsFiles(dtsFiles);
    const result = { concatenatedContent };
    const outputFilePath = path.join("app/components", "dts.json");
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
    console.log(`\nSaved to ${outputFilePath}`);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Run the program
processDtsFiles();
