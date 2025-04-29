import { Request, Response } from 'express';
// Optional: Import your database model for saving contact inquiries
// import Contact from '../models/Contact';

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  const { name, email, message } = req.body;

  try {
    // Save contact data to the database
    // const newContact = await Contact.create({ name, email, message });

    // Send confirmation response
    res.status(200).json({ message: 'Contact form submitted successfully!' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting contact form', error: error.message });
  }
};