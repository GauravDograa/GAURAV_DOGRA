
const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git");

const FILE_PATH = "./data.json";
const git = simpleGit();

// 🔥 Compact bold letters (fits within 52 columns)
const letters = {
  G: ["111 ","1  1","1   ","1 11","1  1","1  1","111 "],
  A: ["111 ","1  1","1  1","1111","1  1","1  1","1  1"],
  U: ["1  1","1  1","1  1","1  1","1  1","1  1","111 "],
  R: ["111 ","1  1","1  1","111 ","1 1 ","1  1","1  1"],
  V: ["1  1","1  1","1  1","1  1"," 11 "," 11 ","  1 "],
  D: ["111 ","1  1","1  1","1  1","1  1","1  1","111 "],
  O: ["111 ","1  1","1  1","1  1","1  1","1  1","111 "],
};

// 🎯 Name
const name = "GAURAV DOGRA";

// 🧱 Build grid
let grid = Array(7).fill("");

// Add letters with minimal spacing
name.split("").forEach((char) => {
  if (char === " ") {
    for (let i = 0; i < 7; i++) {
      grid[i] += "   "; // space between words
    }
  } else {
    const letter = letters[char];
    for (let i = 0; i < 7; i++) {
      grid[i] += letter[i] + " "; // small spacing
    }
  }
});

// 🎯 Centering logic (safe)
const TOTAL_WEEKS = 52;
const textWidth = grid[0].length;

const leftPadding = Math.max(0, Math.floor((TOTAL_WEEKS - textWidth) / 2));

if (textWidth > TOTAL_WEEKS) {
  grid = grid.map(row => row.slice(0, TOTAL_WEEKS));
} else {
  grid = grid.map(row => " ".repeat(leftPadding) + row);
}

// 🚀 Commit generator
const makeCommits = async () => {
  let startDate = moment().subtract(1, "year").startOf("week");

  for (let col = 0; col < grid[0].length; col++) {
    for (let row = 0; row < 7; row++) {
      if (grid[row][col] === "1") {
        let date = startDate
          .clone()
          .add(col, "weeks")
          .add(row, "days");

        const data = { date: date.format() };

        await jsonfile.writeFile(FILE_PATH, data);

        // 🔥 Multiple commits = darker green
        for (let i = 0; i < 3; i++) {
          await git
            .add([FILE_PATH])
            .commit(date.format(), { "--date": date.format() });
        }
      }
    }
  }

  await git.push();
};

makeCommits();

