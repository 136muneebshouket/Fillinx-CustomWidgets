"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "./utils/use-fetch";
import { Clock, Loader } from "lucide-react";
import { get_api_template } from "@/lib/API/ApiTemplates";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";
import { EllipsisVertical } from "lucide-react";
import WidgetMenu from "@/components/widgets/WidgetMenu";
import { Button } from "@/components/ui/button";

import moment from "moment";
import ListWidgets from "@/components/widgets/ListWidgets";

interface Widget {
  id: string;
  title: string;
  html_content: string;
  css: string;
  js: string;
  head: string;
  height: number;
}

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // const fetchWidgets = async () => {
  //   try {
  //     const response = await get_api_template({
  //       url: TapdayApiPaths?.customWidgets.getList(),
  //     });
  //     // const response = await fetch(`${baseUrl}/custom-widgets`, {
  //     //   method: "GET",
  //     //   headers: {
  //     //     Authorization:
  //     //       "Bearer 229033|iCV3Cf3RYXKS3cV9bBe3R3V2WSz1qTVGH5LscWmI2706d738",
  //     //     "Content-Type": "application/json",
  //     //   },
  //     // });

  //     // if (!response.ok) {
  //     //   throw new Error(`HTTP error! status: ${response.status}`);
  //     // }

  //     // const responseData = await response.json();
  //     // console.log("API Response:", responseData);

  //     // if (responseData && responseData.data) {
  //     //   setWidgets(responseData.data?.data || []);
  //     // }

  //     if ((response as any)?.data) {
  //       setWidgets((response as any)?.data?.data ?? []);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching widgets:", err);
  //     setError(err instanceof Error ? err.message : "Failed to fetch data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // fetchWidgets();
  // }, []);

  // const handleBlockClick = (id: string) => {
  //   router.push(`/custom-blocks?selected-block=${id}`);
  // };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-black">
  //       <div className="flex flex-col items-center gap-4">
  //         <Loader className="w-8 h-8 animate-spin text-white" />
  //         <p className="text-white">Loading custom blocks...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-black">
  //       <div className="text-red-500">Error: {error}</div>
  //     </div>
  //   );
  // }

  const handleCreateNewBlock = async () => {
    // try {
    //   const response = await fetch(`${baseUrl}/custom-widgets`, {
    //     method: "POST",
    //     headers: {
    //       Authorization:
    //         "Bearer 229033|iCV3Cf3RYXKS3cV9bBe3R3V2WSz1qTVGH5LscWmI2706d738",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       type: "page",
    //       title: "New Custom Block",
    //       html_content: '<div class="container">\n  Hello Tapday!\n</div>',
    //       generated_html: "",
    //       css_content:
    //         "* {\n  padding: 0;\n  margin: 0;\n}\n.container {\n  height: 300px;\n  background-color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
    //       js_content: "",
    //       head: "",
    //       height: "300",
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   const result = await response.json();

    //   if (result.success && result.data) {
    //     router.push(`/custom-blocks?selected-block=${result.data.id}`);
    //   }
    // } catch (err) {
    //   console.error("Error creating block:", err);
    // }
    router.push(`/custom-blocks/new`);
  };

  // const refetchWidgets = useCallback(async () => {
  //   await ();
  // }, [fetchWidgets]);

  // console.log(widgets);

  // return (<>
  // <ListWidgets/>
  // </>)

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="w-full">
        <div className="sticky z-30 bg-black top-0  w-full  border-b border-slate-800">
          <div className="flex items-center justify-between p-2 mx-auto w-full md:w-[80%] ">
            <h1 className="text-4xl font-bold text-white  flex-1">
              Custom Blocks
            </h1>
            {/* <button
            onClick={handleCreateNewBlock}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Create New Block
          </button> */}

            <Button
              onClick={handleCreateNewBlock}
              className="bg-white text-black  hover:text-white"
            >
              Create New Block
            </Button>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
        {/* <div className=" mx-2 p-2 ">
          {widgets.map((widget) => (
          

            <div className="max-w-md m-2 my-4 mx-auto bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-slate-700  ">
              <div className="md:flex">
                <div
                  className="md:shrink-0 cursor-pointer rounded-xl shadow-md m-2 overflow-hidden"
                  onClick={() => handleBlockClick(widget.id)}
                >
               
                  <iframe
              
                    className="h-16 w-full object-cover md:w-60 bg-white cursor-pointer"
                    style={{
                      height: `180px`,
                    }}
                    title={`Preview ${widget.id}`}
                    srcDoc={widget.html_content}
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <div
                    className="p-5 w-[90%] cursor-pointer flex flex-col justify-between"
                    onClick={() => handleBlockClick(widget.id)}
                  >
                    <div>
                      <a
                        href="#"
                        className="block mt-1 text-sm leading-tight font-medium text-white hover:underline"
                      >
                        {widget.title || `Block ${widget.id}`}
                      </a>
                      <p className="text-muted-foreground text-sm mt-5">
                        {(widget as any)?.status ? "Active" : "Disable"}
                      </p>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm flex items-center gap-2
                      ">
                        <Clock size={20} />
                        <p>
                          {" "}
                          {moment((widget as any)?.created_at).format("LL") ||
                            ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[10%]">
                    <WidgetMenu
                      widget={widget}
                      refetchWidgets={() => {
                        fetchWidgets();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {widgets.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            No custom blocks found
          </div>
        )} */}


        <ListWidgets/>
      </div>
    </div>
  );
}
