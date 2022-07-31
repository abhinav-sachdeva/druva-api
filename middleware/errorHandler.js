const errorHandler = (err, req, res, next) => {
    const { code: statusCode, msg } = err;
    res.status(statusCode || 500)
    return res.json({ status: "error", msg });
  };
  
  module.exports = errorHandler;