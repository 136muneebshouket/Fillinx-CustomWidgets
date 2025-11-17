"use client"

import { useEffect, useState } from "react"
import { SelectTagComponent } from "./SelectTagComponent"
import { ShopDropdownComponent } from "./ShopDropdownComponent"

export interface SelectShopForWidgetProps {
  onTagChange?: (tag: string) => void
  onShopsChange?: (shops: any) => void
  defaultShops?: any[]
  defaultTag?:any
}

export function SelectShopForWidget({ onTagChange, onShopsChange , defaultShops , defaultTag }: SelectShopForWidgetProps) {
  const [selectedTag, setSelectedTag] = useState<"global" | "shop">("global")
  const [selectedShops, setSelectedShops] = useState<any[]>([])

  useEffect(() => {
    if (defaultShops) {
      setSelectedShops(defaultShops)
      onShopsChange?.(defaultShops)
    }
    if(defaultTag){
      setSelectedTag(defaultTag)
      onTagChange?.(defaultTag)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTagChange = (tag: "global" | "shop") => {
    setSelectedTag(tag)
    onTagChange?.(tag)
    // Reset selected shops when switching to global
    if (tag === "global") {
      setSelectedShops([])
      onShopsChange?.([])
    }
  }

  const handleShopsChange = (shops) => {
    setSelectedShops(shops)
    onShopsChange?.(shops)
  }

  // console.log(selectedShops)

  return (
    <div className="space-y-4 w-full max-w-md">
      <SelectTagComponent value={selectedTag} onChange={handleTagChange} />

      {selectedTag === "shop" && <ShopDropdownComponent selectedShops={selectedShops} onChange={handleShopsChange} />}
    </div>
  )
}
