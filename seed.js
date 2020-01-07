const mongoose = require("mongoose");
const {Package} = require("./models/package");
const parser = require("./debianFileParser");
const config = require("config");


async function seed() {
    await mongoose.connect(config.get("db"));
    const packages = await parser(config.get("file"),config.get("separator"));
    await Package.insertMany(packages);
    mongoose.disconnect();
    console.info("Done!");
  }
  
  seed();