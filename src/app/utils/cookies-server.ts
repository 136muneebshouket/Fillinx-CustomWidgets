"use server";

import { cookies, headers } from "next/headers";

export async function getCookiesNext(props: any) {
  const result: any = {};
  const keyValuePairs = props?.params?.urls?.split("-");
  const paramDropId = props?.searchParams?.dropid;
  const errorHeader = headers().get("error");
  const urlHeader = headers().get("url");
  const errorCookie = cookies().get("error")?.value;
  const error = urlHeader ? errorHeader : errorCookie;
  // const error = urlHeader == url ? errorHeader : errorCookie
  if (keyValuePairs?.length > 1) {
    keyValuePairs.forEach((pair: any) => {
      const [key, value] = pair.split("~");
      if (key && value) {
        result[key] = decodeURIComponent(value);
      }
    });
  }

  const token = cookies().get("token")?.value ?? "";
  const dropId = paramDropId ? paramDropId : 0;
  const shopId = cookies().get("shopId")?.value ?? "";
  const version = Number(cookies().get("version")?.value) ?? 1;
  const devMode = error == "devmode" || false;
  const isSubscriptionEnd = error == "subscription" || false;
  const deActivated = error == "deactivated" || false;
  const redirectTo = cookies().get("redirectTo")?.value;
  const cookiesObject = {
    token,
    shopId,
    dropId,
    version,
    devMode,
    unauthenticated: error == "unauthenticated",
    isSubscriptionEnd,
    deActivated,
    isShopify: false,
    redirectTo,
    permissionPageError: devMode || isSubscriptionEnd || deActivated,
  };
  return result?.isShopify && result?.isShopify.includes("true")
    ? {
        token: result.token,
        shopId: result.shopId,
        version: Number(result.version),
        dropId: paramDropId ? paramDropId : 0,
        unauthenticated: result?.error == "unauthenticated",
        isShopify: result.isShopify,
        devMode: result.error == "devmode",
        isSubscriptionEnd: result.error == "subscription",
        deActivated: result.error == "deactivated",
        redirectTo: result.redirectTo,
        permissionPageError: result.error ? true : false,
      }
    : cookiesObject;
}
