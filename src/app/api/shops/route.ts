export async function GET() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    const shops = [
      { id: "shop-1", name: "Downtown Store", location: "Main Street" },
      { id: "shop-2", name: "Mall Branch", location: "Shopping Center" },
      { id: "shop-3", name: "Airport Shop", location: "Terminal 1" },
      { id: "shop-4", name: "Riverside Store", location: "Riverside Plaza" },
      { id: "shop-5", name: "Central Hub", location: "City Center" },
      { id: "shop-6", name: "Harbor Outlet", location: "Waterfront" },
    ]
  
    return Response.json({ shops })
  }
  