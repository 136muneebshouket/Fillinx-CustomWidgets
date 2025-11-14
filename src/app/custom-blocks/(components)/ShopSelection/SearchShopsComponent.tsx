"use client"

import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface SearchShopsComponentProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearClick: () => void
}

export function SearchShopsComponent({ searchQuery, onSearchChange, onClearClick }: SearchShopsComponentProps) {
  const handleClear = () => {
    onClearClick()
  }

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search shop..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pr-8 bg-background border-input text-foreground bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors hover:bg-slate-800"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground text-slate-400" />
        </button>
      )}
    </div>
  )
}
