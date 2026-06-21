const identify = (req, res, next) => {
  const userId = parseInt(req.headers['x-user-id']);
  if (!userId) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing x-user-id header', details: {} }
    });
  }
  req.userId = userId;
  next();
};

module.exports = identify;