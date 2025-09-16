require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const apiRoutes = require('./routes/api');

// Import seeders
const { runSeeders } = require('./utils/seeders');
const NetworkDiagnostic = require('./utils/networkDiagnostic');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and run seeders
const initializeDatabase = async () => {
    try {
        await connectDB();
        await runSeeders();
    } catch (error) {
        console.log('\n⚠️  MongoDB connection failed!');
        console.log('🔄 Running network diagnostics to identify the issue...\n');
        
        // Run network diagnostic
        try {
            await NetworkDiagnostic.runFullDiagnostic();
        } catch (diagError) {
            console.log('❌ Network diagnostic failed:', diagError.message);
        }
        
        console.log('\n📋 MongoDB Connection Troubleshooting:');
        console.log('=' .repeat(40));
        console.log('1. Check MongoDB Atlas Dashboard:');
        console.log('   - Go to https://cloud.mongodb.com/');
        console.log('   - Verify cluster is running and not paused');
        console.log('   - Check cluster metrics and status');
        console.log('');
        console.log('2. Network Access (IP Whitelist):');
        console.log('   - Go to Network Access in MongoDB Atlas');
        console.log('   - Add your current IP address');
        console.log('   - Or temporarily use 0.0.0.0/0 for testing');
        console.log('');
        console.log('3. Database User:');
        console.log('   - Go to Database Access in MongoDB Atlas');
        console.log('   - Verify user "alitariqcode_db_user" exists');
        console.log('   - Check user has readWrite permissions');
        console.log('');
        console.log('4. Connection String:');
        console.log('   - Verify the connection string is correct');
        console.log('   - Check for special characters in password');
        console.log('');
        console.log('⚠️  Running in offline mode - Admin panel available but data won\'t persist');
        console.log('📱 You can still test the UI at http://localhost:3000');
    }
};

initializeDatabase();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));


// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Admin panel route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/admin', 'index.html'));
});

// Admin login page
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/admin', 'login.html'));
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 FikrLess server is running on http://localhost:${PORT}`);
    console.log('🎨 Beautiful internship website is ready!');
    console.log(`🔧 Admin panel available at http://localhost:${PORT}/admin`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
