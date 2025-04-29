import cors from 'cors';

export const corsOptions = cors({
  origin: ['http://localhost:3000', 'https://yourfrontend.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});