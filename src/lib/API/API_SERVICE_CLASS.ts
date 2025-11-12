import axios_interceptor from "../axios/interceptor/axiosInterceptor";
import { ErrorParserFn } from "../helpers/errors/errorParsor";

// Assuming axios_interceptor is your configured Axios instance
// and ErrorParserFn is a function that handles error objects.
import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";

// Define a type/interface for the constructor arguments
// This improves type safety when creating an instance of the class
interface getApiServiceConfig {
  method?: string;
  url?: string;
  query?: Record<string, any>; // or specify a more precise type if known
  headers?: any; // Headers are typically strings
}
interface postApiServiceConfig {
  method?: string;
  url?: string;
  payload?: any; // or specify a more precise type if known
  headers?: any; // Headers are typically strings
}

// Assume axios_interceptor is an AxiosInstance
// declare const axios_interceptor: AxiosInstance;
// declare function ErrorParserFn(err: any): void; // Adjust 'any' to a specific Error type if known

export class GetClassApiService {
  private method: string;
  private url: string;
  private query: Record<string, any>;
  private headers: any;

  constructor({ method, url, query, headers }: getApiServiceConfig) {
    // Use non-null assertion or proper null/undefined checks
    this.method = method?.toLowerCase() || "get";
    this.url = url || "";
    this.query = query || {};
    this.headers = headers || {}; // The spread operator handles null/undefined for object merging, but we ensure a default empty object just in case
  }

  async request<T>(): Promise<T | void> {
    // T is a generic type for the expected response data
    try {
      const config: AxiosRequestConfig = {
        method: this.method,
        url: this.url,
        params: this.query, // Axios uses 'params' for GET query strings
        headers: this.headers,
      };

      // Specify the expected response data type T
      const response: AxiosResponse<T> = await axios_interceptor(config);

      return response.data;
    } catch (err) {
      // Error handling function called with the caught error
      ErrorParserFn(err);
      // We return 'void' here as the error is handled and not re-thrown
    }
  }
}

export class PostClassApiService {
  private method: string;
  private url: string;
  private payload: any;
  private headers: any;

  constructor({ method, url, payload, headers }: postApiServiceConfig) {
    this.method = method?.toLowerCase() || "post";
    this.url = url || "";
    this.payload = payload || {};
    this.headers = headers || {};
  }

  async request() {
    try {
      const response = await axios_interceptor({
        method: this.method,
        url: this.url,
        data: this.payload, // `data` is used for POST/PUT
        headers: this.headers,
      });

      return response.data;
    } catch (err) {
      ErrorParserFn(err);
    }
  }
}
