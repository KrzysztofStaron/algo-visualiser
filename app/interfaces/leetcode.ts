import data from "./problems.json";

export type Problem = {
  href: string;
  text: string;
};

export class leetcode {
  static getProblems(page: number, entries: number): Problem[] {
    const startIndex = (page - 1) * entries; // Calculate the starting index
    const endIndex = page * entries; // Calculate the ending index
    const problemsArray = Object.entries(data); // Convert the data object to an array

    const paginatedProblems = problemsArray.slice(startIndex, endIndex).map(
      ([, value]) => value as Problem // Extract only the value (href and text) and cast it to Problem
    );

    return paginatedProblems;
  }

  static getNumberOfPages(entries: number) {
    const problemsArray = Object.entries(data); // Convert the data object to an array
    return Math.ceil(problemsArray.length / entries);
  }
}
