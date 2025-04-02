const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const residentSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        immutable: true
    },
    username: {
        type: String,
        required: true,
        immutable: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    interests: {
        type: [String],
        
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    previousEvents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Event"
    }
},
{timestamps: true})

residentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const Resident = mongoose.model("Resident", residentSchema);

module.exports = {Resident}