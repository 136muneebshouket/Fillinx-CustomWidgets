import { useEffect, useState } from "react";
import { Grid3x3, List, Loader } from "lucide-react";

import { Button } from "../ui/button";

import { WidgetCard } from "./WidgetCard";
import { useRouter } from "next/navigation";
import { get_api_template } from "@/lib/API/ApiTemplates";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";

interface Widget {
  id: string;
  title: string;
  html_content: string;
  generated_html: any;
  css: string;
  js: string;
  head: string;
  height: number;
  created_at: string;
  status: boolean;
  data: any;
  translations: any;
}

export default function ListWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchWidgets = async () => {
    try {
      const response = await get_api_template({
        url: TapdayApiPaths?.customWidgets.getList(),
      });
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

      // if (responseData && responseData.data) {
      //   setWidgets(responseData.data?.data || []);
      // }

      if ((response as any)?.data) {
        setWidgets((response as any)?.data?.data ?? []);
      }
    } catch (err) {
      console.error("Error fetching widgets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWidgets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-white" />
          <p className="text-white">Loading custom blocks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // console.log(widgets)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-gray-100">widget Catalog</h1>
          <p className="text-gray-400">
            Browse through our collection of HTML content widgets
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-gray-400">Showing {widgets.length} widgets</p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-2">View:</span>
            <Button
              variant={viewMode === "grid" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
          </div>
        </div>

        {/* widget Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              viewMode={viewMode}
              refetchWidgets={() => {
                fetchWidgets();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
