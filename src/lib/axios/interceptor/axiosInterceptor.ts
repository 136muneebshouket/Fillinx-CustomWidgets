import axios from "axios";


const axios_interceptor = axios.create();

axios_interceptor.interceptors.request.use(
  async (config) => {

    let token =
      "Bearer 229033|iCV3Cf3RYXKS3cV9bBe3R3V2WSz1qTVGH5LscWmI2706d738";
    config.headers["Authorization"] = token;
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios_interceptor;
