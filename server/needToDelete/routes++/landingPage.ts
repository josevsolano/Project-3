import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { landingPage } from '../controllers/landingPageController.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const router = express.Router();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

import { authenticateUser } from '../middleware/auth.js';

app.get('/api/landingpage', authenticateUser, (req, res) => {
    // Serve the landing page HTML file
    res.sendFile(path.join(__dirname, 'public', 'landingpage.html'));
});

// GET /landingpage - Example route for the landing page
router.get('/', (req, res) => {
    res.send('Welcome to the Landing Page!');
});

export default router;