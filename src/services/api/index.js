import axios from "axios";
import config from "../../config.js";

const request = axios.create({
  baseURL: config.API_ROOT,
  params: {},
});
export { request };
