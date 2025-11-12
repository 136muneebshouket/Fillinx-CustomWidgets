"use server";

import { baseUrl } from "./use-fetch";

export const fetchShop = async (url: string, p: any, extras?: RequestInit) => {
  // 'use server'
  const res = await fetch(`${baseUrl}/shop/${p.shopId}${url}`, {
    headers: {
      Authorization: `Bearer ${p.token}`,
    },
    ...extras,
  }).then((res) => res.json());
  return res;
};
export const fetchShopV2 = async (
  url: string,
  p: any,
  extras?: RequestInit
) => {
  // 'use server'
  const res = await fetch(`${baseUrl}/shop/${p.shopId}${url}`, {
    headers: {
      Authorization: `Bearer ${p.token}`,
    },
    ...extras,
  }).then((res) => res.json());
  return res;
};
