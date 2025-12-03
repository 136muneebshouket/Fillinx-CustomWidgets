import { useCallback } from "react";
import { debounce } from "@/lib/utils";


export const useDebouncedChange = (
  setter: (value: any , key : any) => void,
  delay: number = 500
) => {
  return useCallback(
    debounce((value: any | undefined, key: any | undefined) => {
      setter(value || "", key || "");
    }, delay),
    [setter, delay]
  );
};
