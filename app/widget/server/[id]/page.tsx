import NotFound from "@/components/global/NotFound";
import { ApiPaths } from "@/lib/api-paths/api-paths";
import { getApi } from "@/lib/api/api-service";

import { AlertTriangle, X } from "lucide-react";

const page = async ({ params }: { params: { id: string } }) => {
  //   console.log();
  const widgetId: any = params.id;

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

  let err: any = undefined;
  try {
    const response = await getApi({
      url: ApiPaths.customBlocks.getById(widgetId),
    });
    // console.log(response);
    widgetData = (response as any).data;
  } catch (error: any) {
    console.error(error);
    err = error;
  }

  if (err) {
    return <NotFound msg={(err as any)?.message || ""} />;
  }

  //   console.log(widgetData?.height);

  return (
    <iframe
      title="Widget Content Preview"
      // ref={iframeRef}
      // onLoad={handleIframeLoad} // Run height calculation when content loads
      // srcDoc is the correct and secure way to embed an HTML string
      srcDoc={widgetData?.generated_html}
      // Use the dynamic height state
      style={{
        height: widgetData?.height ? widgetData?.height + "px" : "100%",
      }}
      frameBorder="0"
      // Removed scrolling="no" to allow content to scroll if calculation is insufficient
      // className="rounded-md bg-white transition-all duration-300"
    />
  );
};


export default page;