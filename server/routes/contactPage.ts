import express from 'express';
import { validateContactForm } from '../middleware/validateContactForm';
import { submitContactForm } from '../controllers/contactController';

const router = express.Router();

// POST route for handling contact form submissions
router.post('/submit', submitContactForm);

export default router;

// Route to handle GET requests to the contact page
router.get('/', (req, res) => {
    res.send('Contact Page');
});

// Route to handle POST requests for contact form submissions
router.post('/', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation (can be expanded as needed)
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Handle form submission logic here (e.g., save to database, send email, etc.)
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
});

export default router;