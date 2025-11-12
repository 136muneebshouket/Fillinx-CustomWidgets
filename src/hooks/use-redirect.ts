"use client";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { routerPush } from "./redirect";

export function useRedirect() {
  const originalSegment: string = usePathname();
  const params = useParams();
  const searchparams = useSearchParams();
  const dropid = searchparams.get("dropid");

  console.log("0000:", originalSegment + `?dropid=${dropid}`);
  const updateUrl = (redirectUrl: string, dropSend: boolean = true): string => {
    return routerPush(
      redirectUrl +
        `${
          dropid && dropSend
            ? `${
                redirectUrl.includes("dropid=")
                  ? ""
                  : redirectUrl.includes("?")
                  ? `&dropid=${dropid}`
                  : `?dropid=${dropid}`
              }`
            : ""
        }`,
      originalSegment,
      params
    );
  };
  return { updateUrl };
}
