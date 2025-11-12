import { useMemo } from "react";
import { useGetCookiesClient } from "./use-cookies-client";
import { baseUrl } from "./use-fetch";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

export const useFetch = () => {
  const { shopId, token } = useGetCookiesClient();
  const tapdayAxios = axios.create({
    baseURL: `${baseUrl}/shop/${shopId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return tapdayAxios;
};
export const useFetchV2 = () => {
  const { shopId, token } = useGetCookiesClient();
  const tapdayAxios = axios.create({
    baseURL: `${baseUrl}/shop/${shopId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return tapdayAxios;
};

export const useShopFullFetch = () => {
  const tapdayAxios = useFetch();
  const { shopId, token } = useGetCookiesClient();

  // Only generate the key when both shopId and token are available
  const fetchKey = useMemo(() => {
    return shopId && token ? `${shopId}-${token}` : null;
  }, [shopId, token]);

  const fetcher = useMemo(() => {
    return async () => {
      const response = await tapdayAxios.get("");
      return response;
    };
  }, [tapdayAxios]);

  const { data, isLoading, error, mutate } = useSWRImmutable(fetchKey, fetcher);

  return { data: data?.data, error, isLoading, mutate };
};
