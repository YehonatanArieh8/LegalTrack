// Authorization middleware - checks if the user has permission to access a route
// The user's role is read from the request header: x-user-role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Read the role from the request header
    const role = req.headers['x-user-role'];

    // If the role is missing or not allowed, return 403 Forbidden
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
          details: {}
        }
      });
    }

    // Role is allowed, continue to the route handler
    next();
  };
};

module.exports = authorize;