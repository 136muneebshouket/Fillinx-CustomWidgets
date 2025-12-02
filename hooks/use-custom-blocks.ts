import useSWR from "swr";
import { getApi } from "@/lib/api/api-service";
import { ApiPaths } from "@/lib/api-paths/api-paths";
import { SWRKeys } from "@/lib/api/swr-keys";

export interface CustomBlock {
  id: string;
  title: string;
  html_content: string;
  generated_html?: string;
  css: string;
  js: string;
  head: string;
  height: number;
  created_at: string;
  status: boolean;
  data?: any;
  translations?: any;
  schema?: any;
}

const fetchCustomBlocks = async () => {
  const response = await getApi({
    url: ApiPaths.customBlocks.getList(),
  });
  return response;
};

export function useCustomBlocks(filter?: { isTemplateWidget?: boolean }) {
  const { data, error, isLoading, mutate } = useSWR(
    SWRKeys.customBlocks.list,
    fetchCustomBlocks
  );
  // If filter.isTemplateWidget is true, get only template widgets
  // If filter.isTemplateWidget is false, get only simple widgets
  // If filter.isTemplateWidget is undefined, return only simple widgets
  const widgets = ((data?.data || [])).filter((b: any) => {
    if (filter?.isTemplateWidget === true) return b?.isTemplateWidget === true;
    // If undefined or false, return only simple widgets
    return b?.isTemplateWidget !== true;
  });

  return {
    blocks: widgets,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTemplateBlocks() {
  const { data, error, isLoading, mutate } = useSWR(
    SWRKeys.customBlocks.list,
    fetchCustomBlocks
  );
  // console.log(data)
  const widgets = ((data?.data || [])).filter(
    (b: any) => b?.isTemplateWidget == true
  );

  return {
    blocks: widgets,
    isLoading,
    isError: error,
    mutate,
  };
}


