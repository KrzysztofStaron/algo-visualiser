const fs = require("fs");
const path = require("path");

// Define the root directory to start searching
const rootDirectoryPath = "app/components/visualizers"; // Change this to your directory path

// Function to get all .d.ts files from a directory, including subdirectories
function getDtsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively search in subdirectories
      results = results.concat(getDtsFiles(filePath));
    } else if (file.endsWith(".d.ts")) {
      // Add .d.ts file to results
      results.push(filePath);
    }
  });

  return results;
}

// Function to read and concatenate .d.ts file contents
function concatenateDtsFiles(filePaths) {
  return filePaths.reduce((acc, filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    return acc + "\n" + content; // Concatenate with newline separator
  }, "");
}

// Main function to process .d.ts files and save as a .json
function processDtsFiles() {
  const dtsFiles = getDtsFiles(rootDirectoryPath);

  // Concatenate all .d.ts file contents
  const concatenatedContent = concatenateDtsFiles(dtsFiles);

  // Create a result object with the concatenated content
  const result = {
    concatenatedContent,
  };

  const outputFilePath = path.join("app/components", "dts.json");
  fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
  console.log(`Combined .d.ts files saved to ${outputFilePath}`);
}

// Run the program
processDtsFiles();
