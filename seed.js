const mongoose = require('mongoose');
const {Package} = require('./models/package');
const parser = require('./debianFileParser');
const config = require('config');


async function seed() {
    const db = config.get('db');
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      }).then(() => console.log(`Connected to ${db}...`));;
    const packages = await parser(config.get('file'),config.get('separator'));
    await Package.insertMany(packages);
    mongoose.disconnect();
    console.info('Done with populating the database!');
  }
  
  seed();