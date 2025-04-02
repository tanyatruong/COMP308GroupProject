const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const communityOrganizerSchema = new mongoose.Schema({
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

communityOrganizerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const CommunityOrganizer = mongoose.model("CommunityOrganizer", communityOrganizerSchema);

module.exports = {CommunityOrganizer}