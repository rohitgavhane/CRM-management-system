const jwt = require('jsonwebtoken');

// Middleware to verify the JWT
exports.verifyToken = (req, res, next) => {

  const authHeader = req.header('Authorization');


  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

 
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


exports.checkPermission = (module, action) => {
  return (req, res, next) => {
    try {
   
      if (
        req.user &&
        req.user.permissions &&
        req.user.permissions[module] &&
        req.user.permissions[module][action]
      ) {
   
        next();
      } else {

        return res.status(403).json({ msg: 'Forbidden: You do not have permission for this action' });
      }
    } catch (err) {
      console.error('Error in checkPermission middleware:', err.message);
      res.status(500).send('Server error');
    }
  };
};
