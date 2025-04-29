import express from 'express';
import path from 'path';
import { landingPage } from '../controllers/landingPageController.js';
import { authenticate } from '../middleware/auth.js';

const app = express();
const router = express.Router();
const express = require('express');
const path = require('path');
const router = express.Router();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/landingpage', authenticate, (req, res) => {
    // Serve the landing page HTML file
    res.sendFile(path.join(__dirname, 'public', 'landingpage.html'));
});

// GET /landingpage - Example route for the landing page
router.get('/', (req, res) => {
    res.send('Welcome to the Landing Page!');
});

export default router;