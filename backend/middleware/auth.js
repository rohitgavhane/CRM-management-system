const jwt = require('jsonwebtoken');

// Middleware to verify the JWT
exports.verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no token
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if token is in correct format "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload (contains id, role, and permissions)
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check permissions for a specific action
// This function *returns* the middleware
exports.checkPermission = (module, action) => {
  return (req, res, next) => {
    try {
      // req.user is attached by the verifyToken middleware
      // We check the permissions object that we stored in the JWT
      if (
        req.user &&
        req.user.permissions &&
        req.user.permissions[module] &&
        req.user.permissions[module][action]
      ) {
        // User has permission, proceed
        next();
      } else {
        // User does not have permission
        return res.status(403).json({ msg: 'Forbidden: You do not have permission for this action' });
      }
    } catch (err) {
      console.error('Error in checkPermission middleware:', err.message);
      res.status(500).send('Server error');
    }
  };
};
