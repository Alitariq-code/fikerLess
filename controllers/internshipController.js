const jsonStorage = require('../utils/jsonStorage');
const Joi = require('joi');

// Validation schemas
const programSchema = Joi.object({
    title: Joi.string().required().trim(),
    duration: Joi.string().required().trim(),
    fees: Joi.number().min(0).required(),
    mode: Joi.string().valid('online', 'offline', 'hybrid').default('online'),
    description: Joi.string().allow('').trim()
});

const internshipSchema = Joi.object({
    mentorName: Joi.string().required().trim(),
    profession: Joi.string().required().trim(),
    specialization: Joi.string().allow('').trim(),
    city: Joi.string().required().trim(),
    isMultipleCity: Joi.boolean().default(false),
    cityNote: Joi.string().allow('').trim(),
    programs: Joi.array().items(programSchema).min(1).required(),
    includes: Joi.array().items(Joi.string().trim()),
    additionalInfo: Joi.string().allow('').trim(),
    isActive: Joi.boolean().default(true),
    gradientColors: Joi.object({
        primary: Joi.string().default('blue-900'),
        secondary: Joi.string().default('cyan-600'),
        accent: Joi.string().default('teal-500')
    }),
    sortOrder: Joi.number().default(0)
});

// Get all active internships for public display
const getAllInternships = async (req, res) => {
    try {
        const internships = await jsonStorage.getActiveInternships();
        
        res.json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch internships'
        });
    }
};

// Search internships
const searchInternships = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({
                success: true,
                count: 0,
                data: []
            });
        }

        const internships = await jsonStorage.searchInternships(q);

        res.json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (error) {
        console.error('Error searching internships:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed'
        });
    }
};

// Admin: Get all internships (including inactive)
const getAllInternshipsAdmin = async (req, res) => {
    try {
        const allInternships = await jsonStorage.getInternships();
        const sortedInternships = allInternships.sort((a, b) => {
            if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json({
            success: true,
            data: sortedInternships
        });
    } catch (error) {
        console.error('Error fetching internships for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch internships'
        });
    }
};

// Admin: Create new internship
const createInternship = async (req, res) => {
    try {
        const { error, value } = internshipSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const internship = await jsonStorage.createInternship(value);

        res.status(201).json({
            success: true,
            message: 'Internship created successfully',
            data: internship
        });
    } catch (error) {
        console.error('Error creating internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create internship'
        });
    }
};

// Admin: Update internship
const updateInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = internshipSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const internship = await jsonStorage.updateInternship(id, value);

        res.json({
            success: true,
            message: 'Internship updated successfully',
            data: internship
        });
    } catch (error) {
        if (error.message === 'Internship not found') {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }
        console.error('Error updating internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update internship'
        });
    }
};

// Admin: Delete internship
const deleteInternship = async (req, res) => {
    try {
        const { id } = req.params;
        
        await jsonStorage.deleteInternship(id);

        res.json({
            success: true,
            message: 'Internship deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Internship not found') {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }
        console.error('Error deleting internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete internship'
        });
    }
};

// Admin: Toggle internship status
const toggleInternshipStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const internship = await jsonStorage.toggleInternshipStatus(id);

        res.json({
            success: true,
            message: `Internship ${internship.isActive ? 'activated' : 'deactivated'} successfully`,
            data: internship
        });
    } catch (error) {
        if (error.message === 'Internship not found') {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }
        console.error('Error toggling internship status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle internship status'
        });
    }
};

// Get single internship
const getInternshipById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const internship = await jsonStorage.findInternshipById(id);
        
        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        res.json({
            success: true,
            data: internship
        });
    } catch (error) {
        console.error('Error fetching internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch internship'
        });
    }
};

module.exports = {
    getAllInternships,
    searchInternships,
    getAllInternshipsAdmin,
    createInternship,
    updateInternship,
    deleteInternship,
    toggleInternshipStatus,
    getInternshipById
};
