const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    name: { type: String, required: true },
    userid: { type: String, required: true },
    role: { type: String, required: true },
    dept: { type: String, required: true },
    type: { type: String, required: true },
    days: { type: Number, required: true },
    available: { type: Number, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'Pending' }
}, {
    timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
