// Authorization middleware - checks if the user has permission to access a route
// The user's role is read from the request header: x-user-role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Read the role from the request header
    const role = req.headers['x-user-role'];

    // No role header means unauthenticated — return 401
    if (!role) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide x-user-role header.',
          details: {}
        }
      });
    }

    // Role present but not permitted — return 403
    if (!allowedRoles.includes(role)) {
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

// Allows admin/manager unrestricted access, but 'user' role can only act on their own record
// Requires x-user-id header to identify the requesting user
const authorizeOrSelf = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.headers['x-user-role'];
    const requestingUserId = parseInt(req.headers['x-user-id']);
    const targetId = parseInt(req.params.id);

    // No role header — unauthenticated
    if (!role) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide x-user-role header.',
          details: {}
        }
      });
    }

    // Admin/manager can update any record
    if (allowedRoles.includes(role)) {
      return next();
    }

    // Regular user can only update their own record
    if (role === 'user' && requestingUserId && requestingUserId === targetId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      data: null,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
        details: {}
      }
    });
  };
};

module.exports = { authorize, authorizeOrSelf };