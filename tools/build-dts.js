const fs = require("fs");
const path = require("path");

// Define the directory containing the .d.ts files
const directoryPath = "app/components/visualizers"; // Change this to your directory path

// Function to get all .d.ts files from a directory
function getDtsFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith(".d.ts"));
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
  const dtsFiles = getDtsFiles(directoryPath);
  const filePaths = dtsFiles.map(file => path.join(directoryPath, file));

  // Concatenate all .d.ts file contents
  const concatenatedContent = concatenateDtsFiles(filePaths);

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
