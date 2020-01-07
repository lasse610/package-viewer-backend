const express = require("express");
const packages = require("../routes/packages");

module.exports = function(app) {
    app.use("/api/packages", packages);
};