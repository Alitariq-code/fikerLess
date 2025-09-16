const mongoose = require('mongoose');

// Flexible internship program schema
const InternshipProgramSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    fees: {
        type: Number,
        required: true,
        min: 0
    },
    mode: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'online'
    },
    description: {
        type: String,
        trim: true
    }
});

// Main internship schema
const InternshipSchema = new mongoose.Schema({
    mentorName: {
        type: String,
        required: true,
        trim: true
    },
    profession: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    isMultipleCity: {
        type: Boolean,
        default: false
    },
    cityNote: {
        type: String,
        trim: true,
        default: 'Student can be debuted across multiple cities (depends on city)'
    },
    programs: [InternshipProgramSchema],
    includes: [{
        type: String,
        trim: true
    }],
    additionalInfo: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    gradientColors: {
        primary: {
            type: String,
            default: 'blue-900'
        },
        secondary: {
            type: String,
            default: 'cyan-600'
        },
        accent: {
            type: String,
            default: 'teal-500'
        }
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add indexes for better performance
InternshipSchema.index({ mentorName: 1 });
InternshipSchema.index({ isActive: 1, sortOrder: 1 });
InternshipSchema.index({ city: 1 });

// Virtual for display name
InternshipSchema.virtual('displayName').get(function() {
    return this.mentorName.toUpperCase();
});

// Method to get the cheapest program
InternshipSchema.methods.getCheapestProgram = function() {
    if (this.programs.length === 0) return null;
    return this.programs.reduce((min, program) => 
        program.fees < min.fees ? program : min
    );
};

// Method to get total programs count
InternshipSchema.methods.getProgramsCount = function() {
    return this.programs.length;
};

// Static method to get active internships
InternshipSchema.statics.getActiveInternships = function() {
    return this.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
};

// Pre-save middleware to ensure at least one program exists
InternshipSchema.pre('save', function(next) {
    if (this.programs.length === 0) {
        this.programs.push({
            title: 'Main Program',
            duration: '3 months',
            fees: 5000,
            mode: 'online'
        });
    }
    next();
});

module.exports = mongoose.model('Internship', InternshipSchema, 'Internships');
