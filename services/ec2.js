const AWS = require("aws-sdk");

const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });
const regionalEc2 = (region) =>
  new AWS.EC2({ apiVersion: "2016-11-15", region });

const errorBuilder = (msg) => ({
  status: "error",
  msg,
});

const respBuilder = (data) => ({
  status: "success",
  data,
});

const listRegions = async () => {
  try {
    const { Regions } = await ec2.describeRegions({}).promise();

    const regionMap = Regions.reduce((rm, { RegionName, Endpoint }) => {
      rm[RegionName] = Endpoint;
      return rm;
    }, {});
    return respBuilder(regionMap);
  } catch (listRegionsError) {
    return errorBuilder(listRegionsError.toString());
  }
};

const listSubnets = async ({ vpc } = {}) => {
  const params = {
    Filters: [
      {
        Name: "vpc-id",
        Values: [vpc]
      },
    ],
  };
  try {
    const { Subnets } = await ec2.describeSubnets(params).promise();
    return respBuilder(Subnets);
  } catch (listSubnetError) {
    return errorBuilder(listSubnetError.toString());
  }
};

const listVpc = async ({ next, max, regionCode } = {}) => {
  const listParams = {
    MaxResults: max,
    NextToken: next,
  };
  try {
    let vpcs = [];
    if (regionCode !== process.env.AWS_REGION) {
      const { Vpcs } = await regionalEc2(regionCode)
        .describeVpcs(listParams)
        .promise();
      vpcs = Vpcs;
    } else {
      const { Vpcs } = await ec2.describeVpcs(listParams).promise();
      vpcs = Vpcs;
    }
    return respBuilder(vpcs);
  } catch (listVpcError) {
    return errorBuilder(listVpcError.toString());
  }
};

module.exports = {
  listRegions,
  listVpc,
  listSubnets,
};
