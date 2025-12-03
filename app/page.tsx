"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Moon,
  Sun,
  LayoutGrid,
  List,
  MoreVertical,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomBlocks } from "@/hooks/use-custom-blocks";
import { useRouter } from "next/navigation";
import { useDeleteCustomBlock } from "@/lib/hooks/use-custom-blocks-state";
import { SWRKeys } from "@/lib/api/swr-keys";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import Link from "next/link";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import CustomBlockModal from "@/components/widget/CustomBlockModal";
import BlocksView from "@/components/widget/BlocksView";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [modalOpen, setModalOpen] = useState(false);
  const [showTemplateBlocks, setShowTemplateBlocks] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleCreateNew = () => {
    setModalOpen(false);
    router.push("/custom-blocks/new");
  };

  const handleSelectTemplate = (templateId: string) => {
    setModalOpen(false);
    router.push(`/custom-blocks/new/template/${templateId}`);
  };

  // console.log(modalOpen);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo + Page Name */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-foreground flex items-center justify-center">
                {/* <span className="text-background font-semibold text-xs">
                  TB
                </span> */}
                <Image src={'/custom-favicon.svg'} width={20} height={20} alt="svg"/>
              </div>
              <h1 className="text-base font-medium">Custom Blocks</h1>
            </div>
            <p onClick={()=>setShowTemplateBlocks(false)} className={"text-sm text-muted-foreground cursor-pointer" + " " + (showTemplateBlocks ? "" : "text-white")}>
              {"Custom Blocks"}
            </p>
            <p onClick={()=>setShowTemplateBlocks(true)} className={"text-sm text-muted-foreground cursor-pointer" + " " + (showTemplateBlocks ? "text-white" : "")}>
              {"Template Blocks"}
            </p>
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2">
              {" "}
              {showTemplateBlocks ? "Template" : "Custom"} Blocks
            </h2>
            <p className="text-muted-foreground text-sm">
              Create and manage reusable custom blocks for your templates
            </p>
          </div>
          <div className="flex justify-center items-center gap-1">
            {(showTemplateBlocks == false) ? (
              <Button className="gap-1.5" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Custom Block
              </Button>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="cursor-pointer">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => router.push("/template/new")}
                  className="cursor-pointer"
                >
                  Create Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* View Toggle and Blocks Grid */}
        <BlocksView templateBlocks={showTemplateBlocks} />
      </main>

      {/* Modal for creating/selecting custom block */}
      <CustomBlockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateNew={handleCreateNew}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

// function BlocksView() {

//   return (

//   );
// }
