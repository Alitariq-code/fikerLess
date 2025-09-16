const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Instance method to update last login
UserSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    return await this.save();
};

// Static method to find active users
UserSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true });
};

// Static method to create admin user if doesn't exist
UserSchema.statics.createDefaultAdmin = async function() {
    try {
        const adminExists = await this.findOne({ username: 'admin' });
        
        if (!adminExists) {
            const admin = new this({
                username: 'admin',
                password: '12345678',
                role: 'admin',
                email: 'admin@fikerless.com'
            });
            
            await admin.save();
            console.log('🔐 Default admin user created successfully');
            console.log('👤 Username: admin');
            console.log('🔑 Password: 12345678');
            return admin;
        } else {
            console.log('👤 Admin user already exists');
            return adminExists;
        }
    } catch (error) {
        console.error('❌ Error creating default admin user:', error.message);
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema, 'Users');
