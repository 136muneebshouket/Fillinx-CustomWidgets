"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// Importing Monitor icon for the preview container
import { Copy, Edit, Monitor, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "fillinxsolutions-provider";
import { getallWidgets_swrKey } from "@/lib/API/SWR-RevalidationKeys";
import { useSWRConfig } from "swr";
import { useDeleteCustomBlock } from "@/app/custom-blocks/(hooks)";
import { useRouter } from "next/navigation";

const SingleWidget = ({ widgetData }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { generated_html, title, data } = widgetData;
  const iframeRef = useRef(null);
  const { handleDeleteBlock } = useDeleteCustomBlock();
  // Default to a generous height in case measurement fails
  const [iframeHeight, setIframeHeight] = useState("450px");

  // Function to attempt dynamic height measurement
  const handleIframeLoad = () => {
    try {
      if (iframeRef.current && (iframeRef as any)?.current?.contentWindow) {
        // Attempt to get the scroll height of the embedded document body
        const contentBody = (iframeRef as any)?.current?.contentWindow.document
          .body;

        if (contentBody) {
          // Add a small buffer (e.g., 20px) to prevent scrollbars from appearing unnecessarily
          const calculatedHeight = contentBody.scrollHeight + 20;
          setIframeHeight(`${calculatedHeight}px`);
        }
      }
    } catch (e) {
      console.error("Could not read iframe content height:", e);
      // Fallback to default height if cross-origin access or structure fails
    }
  };

  const handleDeleteWidget = async (widget) => {
    // console.log(widget?.id);
    // return

    if (window.confirm("Do you really want to delete thsi widget ??")) {
      try {
        // const response = await delete_api_template({
        //   url: TapdayApiPaths?.customWidgets.deleteById(widget?.id),
        // });
        // setdeletingBlock(true);
        // Navigate first to prevent rendering with undefined block
        // router.push('/');
        await handleDeleteBlock(widget.id);
        // await refetchWidgets();
        mutate(getallWidgets_swrKey);
        router.push('/');
        toast.success("widget deleted successfully", {
          position: "top-right",
        });
      } catch (error) {
        toast.error("Something went wrong, try again later", {
          position: "top-right",
        });
      } finally {
        // setdeletingBlock(false);
      }
    }
  };

  const editWidget = () => {
    router.push(`/custom-blocks?selected-block=${widgetData.id}`);
  };
  return (
    <>
      {/* Widget Card Container - Increased max width for more fluid feel */}
      <div className="w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header/Title Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-700/50">
          <div className="flex items-center">
            <Monitor className="w-5 h-5 text-indigo-400 mr-2" />
            <h1 className="text-xl font-semibold text-white truncate">
              Widget Preview
            </h1>
          </div>

          <div className="flex justify-center items-center gap-2">
            <span className="text-sm text-gray-400 border border-indigo-400/30 px-3 py-1 rounded-full bg-indigo-900/20 flex-shrink-0 ml-4">
              ID: {widgetData.id}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 "
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-900 border-gray-800"
              >
                <DropdownMenuItem
                  onClick={() => {
                    editWidget();
                  }}
                  className="text-gray-300 focus:bg-gray-800 focus:text-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={() => {
                    handleDeleteWidget(widgetData);
                  }}
                  className="text-red-400 focus:bg-gray-800 focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Iframe Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          <p className="text-sm text-gray-400 mb-3 italic">
            Rendering content for: **{title}**
          </p>

          <div className="w-full bg-gray-900 p-2 rounded-lg border border-gray-600 shadow-inner">
            <iframe
              title="Widget Content Preview"
              ref={iframeRef}
              onLoad={handleIframeLoad} // Run height calculation when content loads
              // srcDoc is the correct and secure way to embed an HTML string
              srcDoc={generated_html}
              // Use the dynamic height state
              style={{ height: iframeHeight, width: "100%" }}
              frameBorder="0"
              // Removed scrolling="no" to allow content to scroll if calculation is insufficient
              className="rounded-md bg-white transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleWidget;
