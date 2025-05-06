import { Request, Response, NextFunction } from 'express';

export const validateContactForm = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        res.status(400).json({ message: 'All fields are required!' });
        return;
    }

    // Validate email format
    if (!validateEmailFormat(email)) {
        res.status(400).json({ message: 'Invalid email address!' });
        return;
    }

    next();
};

export const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateRequestBody = (requiredFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        const missingFields = requiredFields.filter(field => !(field in req.body));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
        }
        next();
    };
};