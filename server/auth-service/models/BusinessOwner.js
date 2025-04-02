const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const businessOwnerSchema = new mongoose.Schema({
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
},
{timestamps: true})

businessOwnerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const BusinessOwner = mongoose.model("BusinessOwner", businessOwnerSchema);

module.exports = {BusinessOwner}