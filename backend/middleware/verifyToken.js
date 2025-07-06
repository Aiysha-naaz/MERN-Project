// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Bearer header

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     console.log('Received Token:', token);  // Log the token for debugging

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');  // Verify token

//     console.log('Decoded Token:', decoded);  // Log the decoded token for debugging

//     req.user = decoded;  // Attach the user info to the request object
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = authenticateToken;


const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
     console.log('✅ Token verified. Decoded payload:', decoded);
    req.user = decoded; // <-- this should include `id` field
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
