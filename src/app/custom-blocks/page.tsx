"use client";
import React, { useEffect, useState } from "react";
import { CustomBlocksRecoilProvider } from "./recoil-provider";
import BlockRenderer from "./block-renderer";
import { defaultCustomBlockItem } from "./recoil";
import { baseUrl } from "../utils/use-fetch";
import { get_api_template } from "@/lib/API/ApiTemplates";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";
import { Loader } from "lucide-react";

const defaultData = {
  blocks: [
    {
      ...defaultCustomBlockItem,
      id: "1",
      generatedHtml: "",
    },
  ],
};

const CustomBlock = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomWidgets = async () => {
      try {
        // const response = await fetch(`${baseUrl}/custom-widgets`, {
        //   method: "GET",
        //   headers: {
        //     Authorization:
        //       "Bearer 229033|iCV3Cf3RYXKS3cV9bBe3R3V2WSz1qTVGH5LscWmI2706d738",
        //     "Content-Type": "application/json",
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // const responseData = await response.json();
        // console.log("API Response:", responseData);

        const response = await get_api_template({
          url: TapdayApiPaths?.customWidgets.getList(),
        });

        const responseData: any = response;

        // console.log(responseData)

        // Update data structure based on API response
        // Adjust this mapping based on actual API response structure
        if (responseData && responseData.data) {
          setData({
            // blocks: responseData?.data?.data.map((widget: any) => ({
            blocks: responseData?.data.map((widget: any) => ({
              ...defaultCustomBlockItem,
              id: widget.id || defaultCustomBlockItem.id,
              title: widget.title || defaultCustomBlockItem.title,
              html: widget.html_content || defaultCustomBlockItem.html,
              css: widget.css_content || defaultCustomBlockItem.css,
              js: widget.js_content || defaultCustomBlockItem.js,
              head: widget.head || defaultCustomBlockItem.head,
              generatedHtml: widget.generated_html || widget.html_content || "",
              height: widget.height || defaultCustomBlockItem.height,
              data: widget.data || defaultCustomBlockItem.data,
              translations:
                widget.translations || defaultCustomBlockItem.translations,
              schema: widget.schema || defaultCustomBlockItem.schema,
              shopType: widget?.shopType,
              shops: widget?.shops,
            })),
          });
        }
      } catch (err) {
        console.error("Error fetching custom widgets:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomWidgets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // console.log(data)

  return (
    <>
      <CustomBlocksRecoilProvider data={data}>
        <BlockRenderer />
      </CustomBlocksRecoilProvider>
    </>
  );
};

export default CustomBlock;
