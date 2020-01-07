const mongoose = require('mongoose');

module.exports = function() {
  const db = "mongodb://localhost";
  mongoose.connect(db)
    .then(() => console.log(`Connected to ${db}...`));
}