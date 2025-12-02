import { ApiPaths } from "@/lib/api-paths/api-paths";
import { getApi } from "@/lib/api/api-service";
import { CustomBlockType } from "@/lib/recoil/custom-blocks-state";
import { AlertTriangle, X } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
const WidgetForm = dynamic(
  () => import("@/components/widget/WidgetForm").then((mod) => mod.default),
  { ssr: true }
);

const page = async ({ params }: { params: any }) => {
  const widgetId = params["id"];

  //   console.log(isNaN(widgetId));

  if (isNaN(widgetId)) {
    return (
      <>
        {/* Error Notification Component */}
        <div className="w-full max-w-sm">
          <div
            className="flex items-center p-4 text-white bg-red-600 rounded-xl shadow-2xl transition duration-300 transform 
                     hover:scale-[1.02] active:scale-[0.98] border border-red-700"
            role="alert"
          >
            {/* Icon using lucide-react: AlertTriangle */}
            <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />

            {/* Message Content */}
            <div className="flex-grow font-semibold text-lg">
              Invalid widget ID
            </div>

            {/* Close Button using lucide-react: X */}
            <button
              aria-label="Close notification"
              className="ml-3 p-1 rounded-full text-red-100 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 
                       focus:ring-opacity-75 transition duration-150 ease-in-out"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* End Error Notification Component */}
      </>
    );
  }
  let widgetData: any = undefined;

  let err = undefined;
  try {
    const response = await getApi({
      url: ApiPaths.customBlocks.getById(widgetId),
    });
    widgetData = response?.data;
  } catch (error) {
    console.error(error);
    err = error;
  }

  // console.log(widgetData)
  const RefinedWidget: CustomBlockType = {
    id: widgetData.id,
    title: widgetData.title || "",
    description: widgetData.description || "",
    type: "templateBlocks",
    shopType: widgetData.shopType || "",
    shops: widgetData.shops || [],
    html: widgetData.html_content || "",
    generated_html: widgetData.generated_html || "",
    css: widgetData.css_content || "",
    js: widgetData.js_content || "",
    head: widgetData.head || "",
    height: (widgetData.height || 0).toString(),
    data: widgetData.data || "",
    translations: widgetData.translations || "",
    schema: widgetData.schema || "",
    status: widgetData.status ?? true,
    created_at: widgetData?.created_at || null,
    configuration: widgetData?.configuration,
    pin: widgetData?.pin,
    favourite: widgetData?.favourite,
    isTemplateWidget: false,
  };

  return (
    <>
      {widgetData ? (
        <>
          {" "}
          <WidgetForm defaults={RefinedWidget} editMode={false} />
        </>
      ) : null}
    </>
  );
};

export default page;
