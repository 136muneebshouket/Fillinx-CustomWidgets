import { GetClassApiService, PostClassApiService } from "./API_SERVICE_CLASS";

interface getApiServiceConfig {
  method?: string;
  url: string;
  queryParams?: Record<string, any>; // or specify a more precise type if known
  headers?: any; // Headers are typically strings
}

interface postApiServiceConfig {
  method?: string;
  url: string;
  payload?: any; // or specify a more precise type if known
  headers?: any; // Headers are typically strings
}

export async function upload_api_template_fn({
  url,
  payload,
  method = "POST",
  headers = {},
}: postApiServiceConfig) {
  const apiService = new PostClassApiService({ method, url, payload, headers });
  let api = await apiService.request();
  return api;
}

export async function get_api_template({
  method = "GET",
  url,
  queryParams,
  headers = {},
}: getApiServiceConfig) {
  const apiService = new GetClassApiService({
    method: method,
    url,
    query: queryParams,
    headers,
  });
  let api = await apiService.request();
  return api;
}
export async function delete_api_template({
  method = "DELETE",
  url,
  queryParams,
  headers = {},
}: getApiServiceConfig) {
  const apiService = new GetClassApiService({
    method: method,
    url,
    query: queryParams,
    headers,
  });
  let api = await apiService.request();
  return api;
}
