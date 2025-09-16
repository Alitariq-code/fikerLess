const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jsonStorage = require('../utils/jsonStorage');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            username: user.username, 
            role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.adminToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user in JSON storage
        const user = await jsonStorage.findUser({ 
            username: username.toLowerCase(),
            isActive: true 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await jsonStorage.updateUser(user._id, { 
            lastLogin: new Date().toISOString() 
        });

        const token = generateToken(user);

        // Set cookie for web interface
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

// Admin logout
const adminLogout = (req, res) => {
    res.clearCookie('adminToken');
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Check if admin is authenticated
const checkAuth = (req, res) => {
    const token = req.cookies?.adminToken;
    
    if (!token) {
        return res.json({
            success: false,
            authenticated: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        res.json({
            success: true,
            authenticated: true,
            admin: {
                username: decoded.username,
                role: decoded.role
            }
        });
    } catch (error) {
        res.json({
            success: false,
            authenticated: false
        });
    }
};

module.exports = {
    verifyToken,
    adminLogin,
    adminLogout,
    checkAuth,
    generateToken
};
