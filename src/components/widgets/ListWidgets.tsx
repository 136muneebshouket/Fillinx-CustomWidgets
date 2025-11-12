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
  css: string;
  js: string;
  head: string;
  height: number;
  created_at : string;
  status : boolean;
}

const widgets = [
  {
    id: 1,
    created_at: "2025-11-01T10:30:00Z",
    html_content: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: Arial, sans-serif;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            h1 { color: #667eea; margin: 0 0 10px 0; font-size: 24px; }
            p { color: #666; margin: 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Premium Card Design</h1>
            <p>Beautiful gradient background with modern card layout</p>
          </div>
        </body>
      </html>
    `,
    status: "active",
  },
  {
    id: 2,
    created_at: "2025-11-03T14:15:00Z",
    html_content: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(to right, #f093fb 0%, #f5576c 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .container {
              text-align: center;
              color: white;
            }
            h1 { font-size: 48px; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
            .badge {
              background: rgba(255,255,255,0.2);
              padding: 10px 20px;
              border-radius: 25px;
              display: inline-block;
              backdrop-filter: blur(10px);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Creative Design</h1>
            <div class="badge">Modern UI Component</div>
          </div>
        </body>
      </html>
    `,
    status: "active",
  },
  {
    id: 3,
    created_at: "2025-11-05T09:45:00Z",
    html_content: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: #0f172a;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              width: 200px;
            }
            .box {
              aspect-ratio: 1;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              border-radius: 8px;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          </style>
        </head>
        <body>
          <div class="grid">
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
          </div>
        </body>
      </html>
    `,
    status: "pending",
  },
  {
    id: 4,
    created_at: "2025-11-06T16:20:00Z",
    html_content: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff6b6b);
              background-size: 400% 400%;
              animation: gradient 15s ease infinite;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .content {
              background: white;
              padding: 40px;
              border-radius: 20px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h2 { margin: 0; color: #2c3e50; font-size: 28px; }
          </style>
        </head>
        <body>
          <div class="content">
            <h2>Animated Gradient</h2>
          </div>
        </body>
      </html>
    `,
    status: "inactive",
  },
  {
    id: 5,
    created_at: "2025-11-07T11:30:00Z",
    html_content: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: #1a1a2e;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .terminal {
              background: #0f0f23;
              border: 2px solid #00ff41;
              border-radius: 8px;
              padding: 20px;
              font-family: 'Courier New', monospace;
              color: #00ff41;
              width: 300px;
            }
            .line { margin-bottom: 10px; }
            .cursor {
              display: inline-block;
              width: 8px;
              height: 16px;
              background: #00ff41;
              animation: blink 1s infinite;
            }
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          </style>
        </head>
        <body>
          <div class="terminal">
            <div class="line">$ system.start()</div>
            <div class="line">> Loading...</div>
            <div class="line">> Ready<span class="cursor"></span></div>
          </div>
        </body>
      </html>
    `,
    status: "active",
  },
  {
    id: 6,
    created_at: "2025-11-08T13:00:00Z",
    html_content: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(to bottom right, #1e3a8a, #3b82f6);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .profile {
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 20px;
              padding: 30px;
              text-align: center;
              color: white;
            }
            .avatar {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 50%;
              margin: 0 auto 20px;
            }
            h3 { margin: 0 0 10px 0; font-size: 24px; }
            p { margin: 0; opacity: 0.8; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="profile">
            <div class="avatar"></div>
            <h3>Glass Morphism</h3>
            <p>Modern UI Design Trend</p>
          </div>
        </body>
      </html>
    `,
    status: "active",
  },
];

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
