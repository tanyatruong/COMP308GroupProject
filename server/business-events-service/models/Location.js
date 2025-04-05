const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Location = mongoose.model("Location", locationSchema);

module.exports = { Location };