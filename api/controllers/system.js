const express = require("express");

const router = express.Router({ mergeParams: true });

const { responder } = require("@modv/base-express").middlewares;
const { asyncHandler } = require("@modv/base-express").helpers;

const HealthcheckService =
  require("../services/healthcheck").HealthcheckService;
const healthcheckService = new HealthcheckService();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    responder.asHttpResponse(healthcheckService.data, req, res);
  })
);

module.exports = router;
