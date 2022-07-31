const getBaseUrl = (req) =>
  `${req.protocol}://${req.headers["x-forwarded-host"] || req.get("host")}`;

const errorResponse = (res, message, statuscode) => {
  res.status(statuscode || 500);
  return res.json({
    status: "error",
    message,
  });
};

const successResponse = (res, data, statuscode) => {
  res.status(statuscode || 200);
  return res.json({
    status: "success",
    data,
  });
};

const buildResponse = (res, { status, data, msg, statuscode }) => {
  if (status === "error") {
    return errorResponse(res, msg, statuscode);
  }
  return successResponse(res, data, statuscode);
};

module.exports = {
  getBaseUrl,
  errorResponse,
  successResponse,
  buildResponse,
};
