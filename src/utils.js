import { default as axiosBase } from "axios";
import conf from "conf";

export let inDev = process.env.NODE_ENV !== "production";
// inDev = true;

const axiosProd = axiosBase.create({
  baseURL: conf.get("SERVER_URL"),
  // withCredentials: true
  /* other custom settings */
});

//use react proxy defined in package.json in development
//use the baseurl defined above in prod
export const axios = inDev ? axiosBase : axiosProd;
