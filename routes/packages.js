const express = require('express');
const router = express.Router();
const {Package} = require('../models/package');


router.get('/', async (req, res) => {
  const movies = await Package.find()
    .select('-__v')
    .sort('package');
  res.send(movies);
});

router.get('/:name', async (req, res) => {
  const package = await Package.findOne({package:`${req.params.name}`}).select('-__v');

  if (!package)
    return res.status(404).send('The package with the given name was not found.');

  res.send(package);
});

  module.exports = router;