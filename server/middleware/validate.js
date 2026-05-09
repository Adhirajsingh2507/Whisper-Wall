export const validatePost = (req, res, next) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Message cannot be empty',
    });
  }

  if (message.length > 300) {
    return res.status(400).json({
      success: false,
      message: 'Message cannot exceed 300 characters',
    });
  }

  next();
};
