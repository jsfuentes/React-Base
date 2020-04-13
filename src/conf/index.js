/*
 Inspired by thttps://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 Mimics the interface of npm package `config`
*/
import _ from "lodash";
import defaults from "conf/default.js";
let envConf;
try {
  const moduleEnv = require("./" +
    (process.env.NODE_ENV || "development") +
    ".js");
  envConf = moduleEnv.default;
} catch (_) {} //if fails to find proper file, just use defaults
const obj = _.defaultsDeep(envConf, defaults);
// console.log(envConf, process.env.NODE_ENV, obj);

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
export default conf;
