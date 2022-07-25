const config = require("config");
const axios = require("axios").default;
const logger = require("@modv/base-common").helpers.logger;

class HealthcheckService {
  constructor() {
    this.data = [];
    this._endpoints = [];

    const context = this;
    const seconds = 30;

    var CronJob = require("cron").CronJob;
    var job = new CronJob(
      `*/${seconds} * * * * *`,
      function () {
        context._endpoints = [];
        context.#updateSwagger();
        console.log(`You will see this message every ${seconds} second(s)`);
      },
      null,
      true,
      "America/Los_Angeles"
    );
  }

  //Get the latest version of the swagger.json file
  async #updateSwagger() {
    try {
      const swaggerUrl = config.get("swaggerDocEndpoint");

      //ToDo fetch data using Axios
      let promise = await (await axios.get(swaggerUrl)).data.paths;
      let endpoints = Object.keys(promise);
      endpoints.forEach((endpoint) => {
        const endpointObj = promise[endpoint];
        if (endpointObj?.get?.tags?.includes("Healthcheck")) {
          this._endpoints.push(endpoint);
        }
      });
      this.#updateData();
    } catch (err) {
      logger.error("Failed to get swagger.json, err");
    }
  }

  //Update healthcheck data
  async #updateData() {
    let intialRun = this.data.length == 0;
    let initialData = [];
    for (const endpoint of this._endpoints) {
      // console.log({ endpoint });
      try {
        //ToDo query all endpoints getting latest healthcheck
        let result = await axios(`https://api.modv.io${endpoint}`);
        const dataSet = { ...result.data, endpoint, status: "Success" };
        if (this.data.length == 0) {
          initialData.push(dataSet);
        } else {
          for (let i = 0; i < this.data.length == 0; i++) {
            let element = this.data[i];
            if (element.endpoint == endpoint) {
              this.data[i] = dataSet;
              break;
            }
          }
        }
      } catch (err) {
        logger.error(`Failed to data for ${endpoint}, err`);
        for (let i = 0; i < this.data.length == 0; i++) {
          let element = this.data[i];
          if (element.endpoint == endpoint) {
            this.data[i] = {
              ...element,
              status: element.status == "Success" ? "Warning" : "Danger",
            };
            break;
          }
        }
      }
    }
    if (this.data.length == 0) this.data = initialData;
  }
}

module.exports.HealthcheckService = HealthcheckService;
