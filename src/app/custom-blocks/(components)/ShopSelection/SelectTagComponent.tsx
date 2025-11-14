"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface SelectTagComponentProps {
  value: "global" | "shop"
  onChange: (value: "global" | "shop") => void
}

const TAG_OPTIONS = [
  { value: "global", label: "Global" },
  { value: "shop", label: "Shop" },
]

export function SelectTagComponent({ value, onChange }: SelectTagComponentProps) {
  return (
    <div className="space-y-2 ">
      {/* <label className="text-sm text-white font-medium text-foreground">Environment</label> */}
      <Select  value={value} onValueChange={onChange as (val: string) => void}>
        <SelectTrigger  className="w-full bg-transparent text-white border border-slate-800">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white">
          {TAG_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
