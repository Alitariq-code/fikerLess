const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { verifyToken, adminLogin, adminLogout, checkAuth } = require('../middleware/auth');

// Public routes
router.get('/internships', internshipController.getAllInternships);
router.get('/internships/search', internshipController.searchInternships);

// Auth routes
router.post('/admin/login', adminLogin);
router.post('/admin/logout', adminLogout);
router.get('/admin/check-auth', checkAuth);

// Protected admin routes
router.use('/admin', verifyToken); // Apply auth middleware to all admin routes below

// Admin dashboard stats
router.get('/admin/stats', async (req, res) => {
    try {
        const jsonStorage = require('../utils/jsonStorage');
        const stats = await jsonStorage.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
});

// Admin internship management
router.get('/admin/internships', internshipController.getAllInternshipsAdmin);
router.get('/admin/internships/:id', internshipController.getInternshipById);
router.post('/admin/internships', internshipController.createInternship);
router.put('/admin/internships/:id', internshipController.updateInternship);
router.delete('/admin/internships/:id', internshipController.deleteInternship);
router.patch('/admin/internships/:id/toggle', internshipController.toggleInternshipStatus);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
