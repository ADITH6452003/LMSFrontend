const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    role: { type: String, required: true },
    name: { type: String, required: true },
    userid: { type: String, required: true },
    dept: { type: String, required: true },
    password: { type: String, required: true },
    assignedStaff: { type: String },
    assignedHod: { type: String }
}, {
    timestamps: true
});

// Compound unique index for userid + role like SQLite UNIQUE(userid, role)
userSchema.index({ userid: 1, role: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
