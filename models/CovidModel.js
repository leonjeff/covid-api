const mongoose = require("mongoose");

const CovidModel = mongoose.model('CovidModel', {
    date: String,
    state: String,
    cases: Number,
    deaths: Number
})

module.exports = CovidModel;