import { useGetCookiesClient } from "@/app/utils/use-cookies-client";
import { recoil, toast } from "fillinxsolutions-provider";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useFetch, useFetchV2 } from "./auth";
import { revalidate } from "./server";

export const discardAtom = recoil.atom({
  key: "discard",
  default: {
    main: null,
    "product-detail": null,
    global: null,
    collections: null,
    "home-menu": null,
    "home-design": null,
    maintenance: null,
    "app-setting": null,
    "app-listing": null,
    customization: null,
    "product-badges": null,
    "dynamic-products": null,
    integrations: null,
    automation: null,
    "custom-blocks": null,
    "custom-screens": null,
  },
});

export const saveUpdateModal = recoil.atom<{
  modalIsOpen: boolean;
  isSaved: boolean;
  route:
    | ""
    | "/home/main"
    | "/home/collections"
    | "/home/product-detail"
    | "/home/custom-screen"
    | "/home/menu"
    | "/home/design"
    | "/home/maintenance"
    | "/billing/payment";
}>({
  key: "saveUpdateModal",
  default: {
    modalIsOpen: false,
    isSaved: false,
    route: "",
  },
});

export const fetching = recoil.atom({
  key: "fetching",
  default: {
    user: false,
    loginToken: "",
    shop: false,
    homeDropins: {
      loading: false,
      id: "",
      error: false,
      type: "none", // create , edit , delete, none
      swrToken: 0,
    },
    integration: {
      swrToken: 0,
    },
    plans: false,
    homeMain: false,
    homeCollections: false,
    homeProductsDetail: false,
    homeMenu: false,
    homeDesign: false,
  },
});

function convertString(
  input: string,
  shopId: string | undefined,
  pageId?: string | undefined
) {
  const regexShopId = /\[shopId\]/g;
  const regexPageId = /\[pageId\]/g;

  // Replace shopId placeholder if provided
  if (shopId !== undefined) {
    input = input.replace(regexShopId, shopId);
  }

  // Replace pageId placeholder if provided
  if (pageId !== undefined) {
    input = input.replace(regexPageId, pageId);
  }

  return input;
}

export const usePostPage = (pageId) => {
  const setDiscard = recoil.useSetRecoilState(discardAtom);
  // const usr = recoil.useRecoilValue(currentUserIDState)
  // const token = Cookies.get('token')
  const tapdayAxiosV2 = useFetchV2();

  const tapdayAxios = useFetch();
  const { dropId } = useGetCookiesClient();
  // const shopId = Cookies.get('shopId')
  const { shopId, token } = useGetCookiesClient();
  const setLoading = recoil.useSetRecoilState(fetching);
  const [isLoading, setIsLoading] = useState(false);
  const url = `/shop/${shopId}/page?slug=${pageId}`;
  const [isSave, setIsSave] = recoil.useRecoilState(saveUpdateModal);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const endpoint = convertString(url, shopId, pageId.toString());
  const postPage = useCallback(
    async ({
      app_json,
      web_json,
      showToast = true,
      triggerRevalidate = true,
    }: {
      web_json: any;
      app_json: any;
      showToast?: boolean;
      triggerRevalidate?: boolean;
    }) => {
      const body = {
        web_json,
        app_json,
      };
      setIsLoading(true);
      setLoading((prev) => {
        return {
          ...prev,
          homeDesign: true,
        };
      });
      let postPromise;
      if (pageId == "custom-screens") {
        postPromise = tapdayAxiosV2.put(`/custom-page`, {
          web_json: body.web_json,
          id: searchParams.get("screenid"),
        });
      } else {
        postPromise = tapdayAxios.post(
          `/page`,
          {
            web_json,
            slug: pageId,
            ...(pageId !== "custom-blocks" &&
              pageId !== "global" &&
              dropId && {
                drop_id: dropId,
              }),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (showToast) {
        toast.promise(postPromise, {
          loading: "Loading...",
          success: "App has been updated",
          error: "Error",
        });
      }
      if ((await postPromise).status) {
        setIsSave({
          ...isSave,
          isSaved: false,
        });
        const firstPage: any = pageId.split(",")[0];
        setDiscard((prev) => {
          return {
            ...prev,
            [firstPage]: web_json,
          };
        });
        // revalidate page to fetch the latest data
        if (triggerRevalidate) {
          revalidate(`${pathname}?${searchParams.toString()}`);
        }
      }

      setIsLoading(false);
      setLoading((prev) => {
        return {
          ...prev,
          homeDesign: false,
        };
      });
      return postPromise;
    },
    [
      endpoint,
      isSave,
      pageId,
      pathname,
      searchParams,
      setDiscard,
      setIsSave,
      setLoading,
      token,
    ]
  );
  return { postPage, isLoading };
};
