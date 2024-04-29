const fs = require('fs');
const path = require('path');

// Reads a JSON file and returns a JavaScript object
function readJsonFile(filePath) {
  const rawContent = fs.readFileSync('/Users/george/Documents/Interviews/discount/data/db.json');
  return JSON.parse(rawContent.toString());
}

const data = readJsonFile(path.resolve(__dirname, 'data.json'));

const randomGrades = () => Math.floor(Math.random() * 100);
const randomTimeOver = () => Math.floor(Math.random() * 100);

const subjects = [
  { name: "Math" },
  { name: "History" },
  { name: "Chemistry" },
  { name: "Physics" },
  { name: "English" },
  { name: "Literature" },
  { name: "Programming" },
];

const processedData = data.trainees.map((trainee) => {
  const traineeSubjects = subjects.map((subject) => ({
    ...subject,
    grade: randomGrades(),
    time_over: randomTimeOver(),
  }));

  return {
    ...trainee,
    subjects: traineeSubjects,
  };
});

const outputFilePath = path.resolve(__dirname, 'output.json');

// Writes the JavaScript object into a JSON file
fs.writeFileSync(outputFilePath, JSON.stringify(processedData, null, 2));

console.log(`Data has been written to ${outputFilePath}`);
