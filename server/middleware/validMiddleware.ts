import { Request, Response, NextFunction } from 'express';

export const validateRequestBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
    }
    next();
  };
};