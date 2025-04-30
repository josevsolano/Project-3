import express from 'express';
import path from 'path';
import contactRoutes from './routes++/contactPage.js';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import apollo server and graphql

// Contact routes
app.use('/api/contact', contactRoutes);

// Serve static files (if needed for frontend)
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});