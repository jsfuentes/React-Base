import { default as axiosBase } from "axios";
import conf from "conf";

export let inProd = process.env.NODE_ENV === "production";

const axiosProd = axiosBase.create({
  baseURL: conf.get("SERVER_URL"),
  // withCredentials: true
  /* other custom settings */
});

//use react proxy defined in package.json in development
//use the baseurl defined above in prod
export const axios = inProd ? axiosProd : axiosBase;
