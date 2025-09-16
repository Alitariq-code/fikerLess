const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    console.log('🔄 Starting MongoDB connection...');
    console.log('🌐 Environment check:');
    console.log('   - NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('   - DB_NAME:', process.env.DB_NAME || 'fikerless_db');
    console.log('   - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    // Use the hardcoded URI if env variable is not available
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://alitariqcode_db_user:jR8GdNcbqbwYOief@cluster0.w3ijt0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    console.log('🔗 Connection URI (masked):', mongoUri.replace(/\/\/.*@/, '//***:***@'));

    try {
        console.log('⏳ Attempting to connect to MongoDB Atlas...');
        console.log('📋 Connection options:');
        console.log('   - serverSelectionTimeoutMS: 30000');
        console.log('   - socketTimeoutMS: 45000');
        console.log('   - maxPoolSize: 10');
        
        const conn = await mongoose.connect(mongoUri, {
            dbName: process.env.DB_NAME || 'FikerLess',
            serverSelectionTimeoutMS: 10000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });

        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`🏠 Host: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔌 Connection State: ${conn.connection.readyState}`);
        
        // Test database operation
        try {
            console.log('🧪 Testing database operation...');
            const adminDb = conn.connection.db.admin();
            const result = await adminDb.ping();
            console.log('🏓 Database ping successful:', result);
        } catch (pingError) {
            console.log('⚠️ Database ping failed, but connection established');
        }
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB runtime error:', err.message);
            console.error('📋 Error details:', {
                name: err.name,
                code: err.code,
                codeName: err.codeName
            });
        });

        mongoose.connection.on('disconnected', () => {
            console.log('📡 MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        mongoose.connection.on('timeout', () => {
            console.log('⏰ MongoDB connection timeout');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('🛑 Received SIGINT, closing MongoDB connection...');
            await mongoose.connection.close();
            console.log('🔒 MongoDB connection closed through app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection failed!');
        console.error('📋 Detailed error information:');
        console.error('   - Message:', error.message);
        console.error('   - Name:', error.name);
        console.error('   - Code:', error.code);
        
        if (error.reason) {
            console.error('   - Reason:', error.reason);
        }
        
        if (error.cause) {
            console.error('   - Root cause:', error.cause);
        }
        
        // Network-specific debugging
        if (error.message.includes('ETIMEOUT') || error.message.includes('queryTxt')) {
            console.error('🌐 DNS/Network Issue Detected!');
            console.error('💡 Troubleshooting suggestions:');
            console.error('   1. Check your internet connection');
            console.error('   2. Try: ping cluster0.ekjduv5.mongodb.net');
            console.error('   3. Try: nslookup cluster0.ekjduv5.mongodb.net');
            console.error('   4. Check if your firewall blocks MongoDB port (27017)');
            console.error('   5. Verify your IP is whitelisted in MongoDB Atlas (try 0.0.0.0/0 for testing)');
            console.error('   6. Try connecting from a different network/VPN');
        }
        
        if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
            console.error('🔐 Authentication Issue Detected!');
            console.error('💡 Troubleshooting suggestions:');
            console.error('   1. Verify username: alitariqcode_db_user');
            console.error('   2. Verify password is correct');
            console.error('   3. Check if user exists in MongoDB Atlas');
            console.error('   4. Ensure user has proper database permissions');
        }
        
        if (error.message.includes('serverselection')) {
            console.error('🖥️ Server Selection Issue Detected!');
            console.error('💡 Troubleshooting suggestions:');
            console.error('   1. Check if MongoDB Atlas cluster is running');
            console.error('   2. Verify cluster region and your location');
            console.error('   3. Try increasing serverSelectionTimeoutMS');
        }
        
        console.error('🔧 Debug commands to try:');
        console.error('   - Test DNS: nslookup cluster0.ekjduv5.mongodb.net');
        console.error('   - Test connectivity: telnet cluster0.ekjduv5.mongodb.net 27017');
        console.error('   - Check MongoDB Atlas dashboard for cluster status');
        
        throw error; // Re-throw to be caught by server initialization
    }
};

module.exports = connectDB;