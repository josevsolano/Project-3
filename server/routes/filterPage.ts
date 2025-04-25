import express from 'express';

const router = express.Router();

// Define a route for the filter page
router.get('/', (req, res) => {
    res.send('Filter Page API is working!');
});

// Export the router
export default router;