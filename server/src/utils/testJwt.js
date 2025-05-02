const jwt = require('jsonwebtoken');

const secret = 'your_super_secret_key';
const token = jwt.sign({ id: 1, email: 'user@example.com' }, secret, { expiresIn: '1h' });

console.log('Generated Token:', token);

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded Token:', decoded);
} catch (error) {
  console.error('Invalid Token:', error.message);
}