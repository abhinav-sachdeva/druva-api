const express = require("express");

const { ec2: ec2Service } = require("../services");
const { validateRegion } = require("../middleware");
const { path } = require("../constants");

const {
  common: { getBaseUrl, buildResponse },
} = require("../utils");

const ec2Router = express.Router();

const listRegions = async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const regions = await ec2Service.listRegions();
  for (const region in regions.data) {
    regions.data[region] = {
      vpc: `${baseUrl}${path.serverRoute}/vpc/${region}`,
    };
  }
  return buildResponse(res, regions);
};

const listVpcs = async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const { next, max } = req.query;
  const { regionCode } = req.params;
  const vpcs = await ec2Service.listVpc({ next, max, regionCode });
  vpcs.data.forEach(vpc => {
    vpc.subnet = `${baseUrl}${path.serverRoute}/subnet/${vpc.VpcId}`;
  });
  return buildResponse(res, vpcs);
};

const listSubnets = async (req, res) => {
  const { vpcId } = req.params;
  const subnets = await ec2Service.listSubnets({ vpc: vpcId });
  return buildResponse(res, subnets);
};

ec2Router.get("/region", listRegions);
ec2Router.get("/vpc", validateRegion, listVpcs);
ec2Router.get("/vpc/:regionCode", validateRegion, listVpcs);
ec2Router.get("/subnet/:vpcId", listSubnets);

module.exports = ec2Router;
