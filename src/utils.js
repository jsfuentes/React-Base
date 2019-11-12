import { default as axiosBase } from "axios";

const axiosProd = axiosBase.create({
  baseURL: "https://api.modulo.blog"
  // withCredentials: true
  /* other custom settings */
});

//use react proxy defined in package.json in development
//use the baseurl defined above in prod
let isProd = process.env.NODE_ENV === "production";
// isProd = true;
// console.log("Routing all requests based on isProd =", isProd);
export const axios = isProd ? axiosProd : axiosBase;
