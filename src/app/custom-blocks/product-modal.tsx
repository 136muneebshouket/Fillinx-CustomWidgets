/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "fillinxsolutions-provider";
import { CustomBlockProductType } from "./types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  setClose: (data?: {
    product: CustomBlockProductType;
    replaceableString: string;
  }) => void;
  product: CustomBlockProductType;
}

export const ProductModal = ({
  open,
  setClose,
  product: selectedProduct,
}: Props) => {
  const [path, setPath] = useState<string[]>([]); // Path for navigation
  const [selectedKey, setSelectedKey] = useState<string>("");

  const currentData = path.reduce((acc: any, key) => acc[key], selectedProduct);

  const handleSelect = (key: string) => {
    if (typeof currentData[key] === "object" && currentData[key] !== null) {
      setPath([...path, key]);
    } else {
      setSelectedKey(key);
    }
  };

  const handleBack = () => {
    setPath(path.slice(0, -1));
    setSelectedKey("");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="!w-[500px] overflow-hidden !p-0 !m-0">
        <div className="p-3">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Select Product Property
          </h2>
          {path.length > 0 && (
            <div className="text-sm text-muted-foreground flex items-center justify-center mb-4">
              <span className="font-medium">Path:</span>
              <span className="ml-2 text-primary">{path.join(" > ")}</span>
            </div>
          )}
        </div>
        <div className="h-[500px] space-y-2.5 overflow-auto px-4 w-full">
          {Object.entries(currentData).map(([key, value], index) => {
            const isObject = typeof value === "object" && value !== null;
            const isArray = Array.isArray(value);

            return (
              <div
                key={index}
                onClick={() => handleSelect(key)}
                className={cn(
                  "border p-2 rounded-md space-y-2.5 hover:bg-cardinner duration-300",
                  {
                    "bg-cardinner border-primary": selectedKey === key,
                  }
                )}
                role="button"
              >
                <Badge>{key}</Badge>
                <div className="text-sm text-muted-foreground break-words">
                  {isArray ? (
                    `Array (${value.length} items)`
                  ) : isObject ? (
                    "Object"
                  ) : key === "image" ||
                    (typeof value === "string" &&
                      value.includes("files") &&
                      typeof value === "string") ? (
                    <img src={value as any} height={100} width={100} alt="" />
                  ) : (
                    String(value)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end border-t p-3 gap-2.5">
          {path.length > 0 && (
            <Button onClick={handleBack} variant={"ghost"}>
              Back
            </Button>
          )}
          <div className="flex gap-2.5">
            <Button
              onClick={() => setClose()}
              variant={"ghost"}
              className="hover:bg-cardinner"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedKey) {
                  return toast.error("Please select a product property", {
                    position: "top-right",
                  });
                }
                const selectedValue = path?.reduce(
                  (acc: any, key) => acc[key],
                  selectedProduct
                )[selectedKey];

                setClose({
                  product: selectedProduct,
                  replaceableString: String(selectedValue),
                });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
