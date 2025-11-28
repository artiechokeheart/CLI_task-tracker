const { createInterface } = require("node:readline");
const fs = require("fs");
const { writeFile } = require("node:fs");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "task-cli ",
});

rl.prompt();

rl.on("line", (input) => {
  const command = input.toLocaleLowerCase().trim();

  if (command.startsWith("add")) {
    add(input);
  }

  rl.prompt();
});

// Task Properties
// Each task should have the following properties:

// id: A unique identifier for the task

// description: A short description of the task

// status: The status of the task (todo, in-progress, done)

// createdAt: The date and time when the task was created

// updatedAt: The date and time when the task was last updated

// Make sure to add these properties to the JSON file when adding a new task and update them when updating a task.

function add(input) {
  const newTask = {
    id: 0,
    description: input.slice(3).trim(),
    status: "todo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  lookForTrackerJson(newTask);
  //create an object (check for existing file with objects), add object to json
  //   console.log(`Output: Task added successfully (ID: 1)`);
}

function lookForTrackerJson(task) {
  fs.readFile("tracker.json", "utf8", (err, data) => {
    if (err) {
      if (err.errno === -2) {
        console.log("creating json file for:", task);
        const addTask = JSON.stringify(task);
        writeFile("tracker.json", addTask, (err) => {
          if (err) throw err;
          console.log("The file has been created!");
        });
      }
      console.log(err, "logging error in lookForTrackerJson");
      throw err;
    }

    const tasks = JSON.parse(data);
    console.log(tasks, "finished");
  });
}
