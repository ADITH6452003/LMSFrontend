require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Request = require('./models/Request');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretleavemanagementkey';

// Database Connection
connectDB();

// Default Principal Seed
const seedPrincipal = async () => {
    try {
        const principal = await User.findOne({ role: 'principal', userid: 'admin' });
        if (!principal) {
            await User.create({
                role: 'principal',
                name: 'Principal',
                userid: 'admin',
                dept: 'ALL',
                password: 'admin'
            });
            console.log("Default Principal seeded.");
        }
    } catch (error) {
        console.error("Error seeding principal:", error);
    }
};
seedPrincipal();

// 1. AUTHENTICATION
app.post('/api/auth/login', async (req, res) => {
    try {
        const { role, name, userid, dept, password } = req.body;
        let user = null;

        if (role === 'principal') {
            user = await User.findOne({ role: 'principal', name: { $regex: new RegExp(`^${name}$`, 'i') } });
        } else {
            user = await User.findOne({ role, userid, dept });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Account not found' });
        }

        // Exact plain-text matching for seamless legacy transition
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role, userid: user.userid, dept: user.dept }, JWT_SECRET, { expiresIn: '8h' });
        
        // Convert to object so we don't leak Mongoose document internals back to client expecting old format
        const userObj = user.toObject();
        userObj.id = userObj._id.toString();
        
        res.json({ success: true, token, user: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

app.post('/api/auth/change-password', async (req, res) => {
    try {
        const { role, userid, dept, oldPassword, newPassword } = req.body;
        if (role === 'principal') return res.status(403).json({ success: false, message: 'Cannot change principal password via API' });

        const user = await User.findOne({ role, userid, dept });
        if (!user) return res.status(404).json({ success: false, message: 'User account not found' });

        if (user.password !== oldPassword) return res.status(401).json({ success: false, message: 'Incorrect old password' });

        user.password = newPassword;
        await user.save();
        
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. USER MANAGEMENT
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'role name userid dept assignedStaff assignedHod -_id'); // Exclude _id to match previous shape if needed
        res.json(users);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { role, name, userid, dept, password, assignedStaff, assignedHod } = req.body;
        
        const existing = await User.findOne({ userid, role });
        if (existing) return res.status(400).json({ success: false, message: 'ID already exists mapping to this role.' });

        await User.create({
            role, 
            name, 
            userid, 
            dept, 
            password, 
            assignedStaff: assignedStaff || null, 
            assignedHod: assignedHod || null
        });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/users/:role/:userid', async (req, res) => {
    try {
        const { role, userid } = req.params;
        await User.findOneAndDelete({ role, userid });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. LEAVE REQUESTS
app.get('/api/requests', async (req, res) => {
    try {
        let requests = await Request.find();
        
        // Map _id to id to maintain frontend compatibility
        requests = requests.map(req => {
            const reqObj = req.toObject();
            reqObj.id = reqObj._id.toString();
            return reqObj;
        });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/requests', async (req, res) => {
    try {
        const { name, userid, role, dept, type, days, available, fromDate, toDate, reason } = req.body;
        await Request.create({
            name, userid, role, dept, type, days, available, fromDate, toDate, reason
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/requests/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Request.findByIdAndUpdate(id, { status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT} (MongoDB)`);
});
