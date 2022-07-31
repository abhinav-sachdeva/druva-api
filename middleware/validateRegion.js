const regionSet = new Set([
  "eu-north-1",
  "ap-south-1",
  "eu-west-3",
  "eu-west-2",
  "eu-west-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-northeast-1",
  "sa-east-1",
  "ca-central-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
]);
const validateRegion = (req, _, next) => {
  const { regionCode } = req.params;
  if (!(regionCode && regionSet.has(regionCode))) {
    next({ msg: "Invalid region" })
  }
  next();
};
module.exports = validateRegion;