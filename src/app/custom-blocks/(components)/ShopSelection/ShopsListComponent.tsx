"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";
import { get_api_template } from "@/lib/API/ApiTemplates";
import { da } from "date-fns/locale";

export interface Shop {
  id: string;
  name: string;
  location?: string;
}

export interface ShopsListComponentProps {
  searchQuery: string;
  selectedShops: string[];
  onChange: (shops: any[]) => void;
}

const fetcher = async (url: string) => {
  const res = await get_api_template({
    method: "GET",
    url: url,
  });
  // if (!res.ok) throw new Error("Failed to fetch shops");
  return res as any;
};

export function ShopsListComponent({
  searchQuery,
  selectedShops,
  onChange,
}: ShopsListComponentProps) {
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);

  const { data, isLoading, error } = useSWR(
    searchQuery
      ? `${TapdayApiPaths.shops.getList()}?search=${encodeURIComponent(
          searchQuery
        )}&per_page=10`
      : TapdayApiPaths.shops.getList() + "?per_page=10",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 500,
    }
  );

  useEffect(() => {
    let shops = data?.data?.data || [];
    if (shops) {
      setFilteredShops(shops);
    }

    // console.log(data?.data?.data);
  }, [data]);

  // useEffect(() => {
  //   if (selectedShops?.length === 0) return;
  //   let both = [...selectedShops, ...filteredShops] as [];
  //   setFilteredShops(both);
  // }, [selectedShops]);

  const handleShopToggle = (shop) => {
    let newShop = { id: shop.id, name: shop.name };
    const isSelected = selectedShops.find((obj: any) => obj.id === shop.id);
    const newSelectedShops = isSelected
      ? selectedShops.filter((obj: any) => obj.id !== shop.id)
      : [...selectedShops, newShop];
    onChange(newSelectedShops);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 bg-background dark:bg-slate-950">
        <Loader className="h-5 w-5 animate-spin text-muted-foreground dark:text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 text-center text-sm text-destructive dark:text-red-400 bg-background dark:bg-slate-950">
        Failed to load shops
      </div>
    );
  }

  if (filteredShops.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground dark:text-slate-400 bg-background dark:bg-slate-950">
        {searchQuery
          ? `No shops found matching "${searchQuery}"`
          : "No shops available"}
      </div>
    );
  }
  

  return (
    <div className="space-y-2 p-4 bg-background bg-slate-950">
      {filteredShops.map((shop) => (
        <div
          key={shop.id}
          className="flex items-start space-x-3 py-2 hover:bg-muted rounded px-2 transition-colors hover:bg-slate-800"
        >
          <Checkbox
            id={shop.id}
            checked={selectedShops.some((obj: any) => obj.id == shop.id)}
            onCheckedChange={() => handleShopToggle(shop)}
            className="mt-1 border-slate-600"
          />
          <label
            htmlFor={shop.id}
            className="flex-1 cursor-pointer text-sm font-medium leading-tight"
          >
            <div className="text-foreground text-slate-50">{shop.name}</div>
            {shop.location && (
              <div className="text-xs text-muted-foreground text-slate-400">
                {shop.location}
              </div>
            )}
          </label>
        </div>
      ))}
    </div>
  );
}
