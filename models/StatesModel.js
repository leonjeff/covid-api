const mongoose = require("mongoose");

const StatesModel = mongoose.model('StatesModel', {
    name: String,
    abreviation: String,
})

module.exports = StatesModel;