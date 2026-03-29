const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    try {
        const { regNo, password, role } = req.body;
        
        const userExists = await User.findOne({ regNo });
        if (userExists) {
            return res.status(400).json({ message: 'Registration Number already exists' });
        }

        const user = await User.create({ regNo, password, role });
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                regNo: user.regNo,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data provided' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { regNo, password, role } = req.body;
        
        const user = await User.findOne({ regNo, role });
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                regNo: user.regNo,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials or incorrect role selection' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
