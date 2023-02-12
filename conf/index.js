/*
 Inspired by https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 Mimics the interface of npm package `config`
*/
const _ = require("lodash");
const defaults = require("./default.js");
//looks like react?, replaces this at compile time automatically
let env =
  process.env.RENDER || process.env.NODE_ENV == "production"
    ? "production"
    : "development";
const moduleEnv = require("./" + env + ".js");
let envConf = moduleEnv;

const obj = _.defaultsDeep(envConf, defaults);
// if (typeof process !== "undefined" && process.env.RENDER_ETA_STAGING) {
//   //only applies on ./build.sh for webpack publicPath, use window.location.href for actual client code
//   obj.NAME = "Render Staging";
//   obj.SERVER_URL = "https://" + process.env.RENDER_EXTERNAL_HOSTNAME;
//   obj.CLIENT_URL = "https://" + process.env.RENDER_EXTERNAL_HOSTNAME;
// }
console.log(
  `Using ${obj.NAME} config on ${obj.SERVER_URL} - ${process.env.NODE_ENV} ${env} -`
);
// console.log(`Using ${obj.NAME} config`, {
//   RENDER_ETA_STAGING: process.env.RENDER_ETA_STAGING,
//   NODE_ENV: process.env.NODE_ENV,
//   env,
//   envConf,
// });

class Config {
  constructor(obj) {
    this.conf = obj;
  }

  get(key) {
    if (!(key in this.conf)) {
      throw new Error(`${key} not found in configuration, check config folder`);
    }
    return this.conf[key];
  }

  has(key) {
    return key in this.conf;
  }
}

const conf = new Config(obj);
module.exports = conf;
