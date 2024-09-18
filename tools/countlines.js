const fs = require("fs");
const path = require("path");

// Get the directory path from command line argument or default to 'app'
const rootDirectoryPath = process.argv[2] || "../app";

// File extensions to include in the search
const fileExtensions = [".tsx", ".js", ".ts", ".jsx"];

/**
 * Recursively searches for files with specific extensions in a directory.
 * @param {string} dir - The directory to search.
 * @returns {string[]} Array of file paths with the specified extensions.
 */
function getFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        // Recursively search in subdirectories
        results = results.concat(getFiles(filePath));
      } else if (fileExtensions.some(ext => file.endsWith(ext)) && !file.endsWith(".d.ts")) {
        // Add file to results if it matches the extensions
        results.push(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory or file: ${dir}\n`, error);
  }
  return results;
}

/**
 * Counts the non-empty lines of code in a file.
 * @param {string} filePath - Path to the file.
 * @returns {number} Number of non-empty lines in the file.
 */
function countLines(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    // Split content by line breaks and filter out empty lines
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
    return lines.length;
  } catch (error) {
    console.error(`Error reading file: ${filePath}\n`, error);
    return 0;
  }
}

/**
 * Processes files and counts the total lines of code.
 */
function processCodeFiles() {
  const codeFiles = getFiles(rootDirectoryPath);
  let totalLines = 0;

  codeFiles.forEach(file => {
    const fileLines = countLines(file);
    totalLines += fileLines;
    console.log(`${file}: ${fileLines} lines`);
  });

  console.log(`\nTotal lines of code: ${totalLines}`);
}

// Run the program
processCodeFiles();
