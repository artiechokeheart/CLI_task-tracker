const { createInterface } = require("node:readline");
const fs = require("fs").promises;

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

async function add(input) {
  const newTask = {
    description: input.slice(3).trim(),
    status: "todo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const JSONexists = await checkForTrackerJSON();

    if (JSONexists) {
      console.log("updating json file");
      await createNewTask(newTask);
    } else {
      console.log("creating json file");
      newTask.id = 1;
      await createFirstTask(newTask);
    }

    console.log(`Output: Task added successfully (ID: ${newTask.id})`);
  } catch (err) {
    console.error(err);
  }
}

async function checkForTrackerJSON() {
  try {
    const data = await fs.readFile("tracker.json", "utf8");
    if (data) {
      return true;
    } else return false;
  } catch (err) {
    if (err.errno !== -2) {
      console.error(err);
    }
  }
}

async function createFirstTask(task) {
  try {
    await fs.writeFile("tracker.json", JSON.stringify([task]));
    console.log("The file has been created!");
  } catch (err) {
    console.error(err);
  }
}

async function createNewTask(task) {
  try {
    const data = JSON.parse(await fs.readFile("tracker.json", "utf8"));
    task.id = data.length + 1;
    data.push(task);
    await fs.writeFile("tracker.json", JSON.stringify(data));
    console.log("The file has been updated");
  } catch (err) {
    console.error(err);
  }
}
