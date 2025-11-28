import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { getApi } from "@/lib/api/api-service";
import { ApiPaths } from "@/lib/api-paths/api-paths";
import { cn } from "@/lib/utils";
import { Check, Loader } from "lucide-react";

export interface Shop {
  id?: string;
  name?: string;
  location?: string;
}

export interface ShopsListComponentProps {
  searchQuery: string;
  selectedShops: string[];
  onChange: (shops: any[]) => void;
}

const fetcher = async (url: string) => {
  const res = await getApi({
    url: url,
  });
  // if (!res.ok) throw new Error("Failed to fetch shops");
  return res as any;
};

const ShopListDropdown = ({
  selectedShops,
  setSelectedShops,
}: {
  selectedShops: Shop[];
  setSelectedShops: any;
}) => {
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useSWR(
    searchQuery
      ? `${ApiPaths.shops.getList()}?search=${encodeURIComponent(
          searchQuery
        )}&per_page=10`
      : ApiPaths.shops.getList() + "?per_page=10",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 500,
    }
  );

  useEffect(() => {
    const shops = data?.data?.data || [];
    if (shops) {
      setFilteredShops(shops);
    }

    // console.log(data?.data?.data);
  }, [data]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center py-8 bg-background dark:bg-slate-950">
  //       <Loader className="h-5 w-5 animate-spin text-muted-foreground dark:text-slate-400" />
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="px-4 py-6 text-center text-sm text-destructive dark:text-red-400 bg-background dark:bg-slate-950">
  //       Failed to load shops
  //     </div>
  //   );
  // }

  // if (filteredShops.length === 0) {
  //   return (
  //     <div className="px-4 py-6 text-center text-sm text-muted-foreground dark:text-slate-400 bg-background dark:bg-slate-950">
  //       {searchQuery
  //         ? `No shops found matching "${searchQuery}"`
  //         : "No shops available"}
  //     </div>
  //   );
  // }

  //   console.log(selectedShops)

  return (
    <PopoverContent className="w-80 p-0">
      <Command>
        <CommandInput
          onValueChange={(value: any) => {
            setSearchQuery(value);
          }}
          placeholder="Search shops..."
          className="h-10"
        />
        <CommandList>
         
          <CommandGroup>
            {selectedShops.map((shop) => {
              const isSelected = selectedShops.some(
                (s: any) => s.id === shop.id
              );
              return (
                <CommandItem
                  className="text-green-700"
                  key={shop.id}
                  value={shop.name}
                  onSelect={() => {
                    if (isSelected) {
                      setSelectedShops(
                        selectedShops.filter((s: any) => s.id !== shop.id)
                      );
                    } else {
                      setSelectedShops([...selectedShops, shop]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 border",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <p className="text-green-700">{shop.name}</p>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <hr />
          {isLoading ? (
            <>
              <div className="flex items-center justify-center py-8 bg-background dark:bg-black">
                <Loader className="h-5 w-5 animate-spin text-muted-foreground dark:text-slate-400" />
              </div>
            </>
          ) : (
            <>
              {error ? (
                <>
                  <div className="px-4 py-6 text-center text-sm text-destructive dark:text-red-400 bg-background dark:bg-black">
                    Failed to load shops
                  </div>
                </>
              ) : (
                <>
                  <CommandGroup>
                    {filteredShops.map((shop) => {
                      const isSelected = selectedShops.some(
                        (s: any) => s.id === shop.id
                      );
                      return (
                        <CommandItem
                          key={shop.id}
                          value={shop.name}
                          onSelect={() => {
                            if (isSelected) {
                              setSelectedShops(
                                selectedShops.filter(
                                  (s: any) => s.id !== shop.id
                                )
                              );
                            } else {
                              setSelectedShops([...selectedShops, shop]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 border",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {shop.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

export default ShopListDropdown;
