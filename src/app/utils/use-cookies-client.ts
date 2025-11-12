import Cookies from "js-cookie";

import { usePathname, useSearchParams } from "next/navigation";
import { isProduction } from "./use-fetch";

type returnType = {
  token: string;
  shopId: string;
  dropId: string;
  version: number;
  activeDropId: string;
  isProduction: boolean;
  devMode: boolean;
  unauthenticated: boolean;
  isSubscriptionEnd: boolean;
  deActivated: boolean;
  isShopify: boolean;
  redirectTo: string | undefined;
  permissionPageError: boolean;
};

export function useGetCookiesClient() {
  const result: any = {};
  const keyValuePairs = usePathname().replace("/", "")?.split("-");
  const dropid = useSearchParams().get("dropid");
  const error = Cookies.get("error");
  // const error = urlHeader == url ? errorHeader : errorCookie
  if (keyValuePairs?.length > 1) {
    keyValuePairs.forEach((pair: any) => {
      const [key, value] = pair.split("~");
      if (key && value) {
        result[key] = decodeURIComponent(value);
      }
    });
  }

  const token = Cookies.get("token") ?? "";
  const shopId = Cookies.get("shopId") ?? "";
  const version = Number(Cookies.get("version")) ?? 0;
  const dropId = dropid ? dropid : 0;
  const activeDropId = Cookies.get("dropId");
  const devMode = error == "devmode" || false;
  const isSubscriptionEnd = error == "subscription" || false;
  const deActivated = error == "deactivated" || false;
  const redirectTo = Cookies.get("redirectTo");
  const cookiesObject = {
    token,
    shopId,
    dropId,
    version,
    activeDropId,
    isProduction: isProduction,
    devMode,
    unauthenticated: error == "unauthenticated",
    isSubscriptionEnd,
    deActivated,
    isShopify: false,
    redirectTo,
    permissionPageError: devMode || isSubscriptionEnd || deActivated,
  };
  return result.isShopify && result.isShopify.includes("true")
    ? ({
        token: result.token,
        shopId: result.shopId,
        version: result.version.includes("2") ? 2 : 1,
        dropId: dropid ? dropid : 0,
        activeDropId: result.dropId,
        isProduction: isProduction,
        unauthenticated: result?.error == "unauthenticated",
        isShopify: result.isShopify,
        devMode: result.error == "devmode",
        isSubscriptionEnd: result.error == "subscription",
        deActivated: result.error == "deactivated",
        redirectTo: result.redirectTo,
        permissionPageError: result.error ? true : false,
      } as returnType)
    : (cookiesObject as returnType);
}
