import { Request, Response, NextFunction } from 'express';

export const validateContactForm = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: 'All fields are required!' });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email address!' });
    return;
  }

  next();
};