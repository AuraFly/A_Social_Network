const connection = require("../config/connection");
const { Thought, User } = require("../models");
const { getRandomName, getRandomThought } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  await Thought.deleteMany({});
  await User.deleteMany({});

  const users = [];
  const thoughts = [];

  for (let i = 0; i < 20; i++) {
    const username = getRandomName(20);
    const thoughtText = getRandomThought(20);
    const email = `${username}@email.com`;

    users.push({
      username,
      email,
    });

    thoughts.push({
      thoughtText,
      username,
    });
  }

  await User.collection.insertMany(users);
  await Thought.collection.insertMany(thoughts);

  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
