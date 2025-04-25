import express from 'express';

const router = express.Router();

// GET /landingpage - Example route for the landing page
router.get('/', (req, res) => {
    res.send('Welcome to the Landing Page!');
});

export default router;