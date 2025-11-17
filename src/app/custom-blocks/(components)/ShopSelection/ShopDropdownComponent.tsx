"use client";

import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { SearchShopsComponent } from "./SearchShopsComponent";
import { ShopsListComponent } from "./ShopsListComponent";

export interface ShopDropdownComponentProps {
  selectedShops: string[];
  onChange: (shops: any[]) => void;
}

export function ShopDropdownComponent({
  selectedShops,
  onChange,
}: ShopDropdownComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // added debounced query state
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const removeShop = (shop) => {
    let newShop = { id: shop.id, name: shop.name };
    let newShops = selectedShops.filter((obj: any) => obj.id !== newShop.id);
    onChange(newShops);
  };

  return (
    <div className="space-y-2">
      {/* <label className="text-sm font-medium text-foreground text-slate-50">
        Select Shop
      </label> */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-transparent border border-input hover:bg-accent hover:text-accent-foreground border-slate-700 hover:bg-slate-900 text-slate-50"
          >
            <span className="text-muted-foreground text-slate-400">
              {selectedShops.length > 0
                ? `${selectedShops.length} shop${
                    selectedShops.length !== 1 ? "s" : ""
                  } selected`
                : "Select shop"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <div className="w-full">
          <div className="flex flex-wrap gap-2 w-full">
            {selectedShops?.length > 0 &&
              selectedShops?.map((obj) => {
                return (
                  <>
                    {/* badge */}
                    <div className="rounded-lg border border-slate-800 shadow-lg p-2 px-3 flex justify-between items-center gap-2">
                      <p className="text-white text-sm">
                        {(obj as any)?.name || ""}
                      </p>
                      <button
                        className="text-slate-400"
                        onClick={() => {
                          removeShop(obj);
                        }}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    {/* badge */}
                  </>
                );
              })}
          </div>
        </div>
        <DropdownMenuContent
          align="start"
          className="w-[350px] p-0 bg-background border border-border bg-slate-950 border-slate-700"
        >
          <div className="p-4 border-b border-border border-slate-700 bg-background bg-slate-950">
            <SearchShopsComponent
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClearClick={handleClearSearch}
            />
          </div>
          <div className="max-h-80 overflow-y-auto bg-background bg-slate-950">
            <ShopsListComponent
              searchQuery={debouncedQuery}
              selectedShops={selectedShops}
              onChange={onChange}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
