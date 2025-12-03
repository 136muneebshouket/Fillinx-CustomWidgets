import { useCustomBlocks } from "@/hooks/use-custom-blocks";
import { SWRKeys } from "@/lib/api/swr-keys";
import { useDeleteCustomBlock } from "@/lib/hooks/use-custom-blocks-state";

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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";

interface BlocksViewProps {
  templateBlocks?: boolean;
}

const BlocksView = ({ templateBlocks = false }: BlocksViewProps) => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { blocks, isLoading, isError } = useCustomBlocks({
    isTemplateWidget: templateBlocks,
  });
  const { handleDeleteBlock } = useDeleteCustomBlock();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading custom blocks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">
          Error loading blocks. Please try again.
        </div>
      </div>
    );
  }

  const handleDeleteWidget = async (widget: any) => {
    if (window.confirm("Do you really want to delete this widget ??")) {
      try {
        // const response = await delete_api_template({
        //   url: TapdayApiPaths?.customWidgets.deleteById(widget?.id),
        // });
        // setdeletingBlock(true);
        // Navigate first to prevent rendering with undefined block
        // router.push('/');
        await handleDeleteBlock(widget.id);
        // router.refresh();
        // await refetchWidgets();
        mutate(SWRKeys.customBlocks.list);
        toast.success("widget deleted successfully", {
          position: "top-right",
        });
      } catch (error) {
        toast.error("Something went wrong, try again later", {
          position: "top-right",
        });
      } finally {
        // setdeletingBlock(false);
      }
    }
  };

  const editWidget = (widget: any) => {
    router.push(`/widget/edit/${widget?.id}`);
  };
  const serverView = (widget: any) => {
    router.push(`/widget/server/${widget?.id}`);
  };
  return (
    <>
      <div>
        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {blocks.length} blocks
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="rounded-r-none border-r"
              >
                <LayoutGrid className="w-4 h-4 mr-1.5" />
                Grid
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4 mr-1.5" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Blocks Grid/List */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block: any) => (
              <Card key={block.id} className="overflow-hidden group p-0 gap-0">
                {/* Preview Area */}
                <Link href={`/widget/edit/${block.id}`}>
                  <div className="relative aspect-video bg-muted flex items-center justify-center border-b overflow-hidden ">
                    <div className="absolute left-0 top-0 h-full w-full z-10 bg-transparent cursor-pointer"></div>
                    {block.generated_html ? (
                      <iframe
                        srcDoc={block.generated_html}
                        title={`Preview ${block.id}`}
                        className="w-full h-full border-0 cursor-pointer"
                        sandbox="allow-scripts"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">
                        {block.title}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Card Footer */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/widget/edit/${block.id}`}>
                        <h3 className="font-medium text-sm">
                          {block.title || "Untitled"}
                        </h3>
                      </Link>
                      {block.status ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {block.html_content?.substring(0, 80) || "No description"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {formatDate(block.created_at)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          editWidget(block);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          serverView(block);
                        }}
                      >
                        Server View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleDeleteWidget(block);
                        }}
                        variant="destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block: any) => (
              <Card key={block.id} className="overflow-hidden p-0 gap-0">
                <div className="p-4 flex items-center gap-4">
                  {/* Preview Thumbnail */}
                  <Link href={`/widget/edit/${block.id}`}>
                    <div className="relative w-40 h-24 bg-muted rounded flex items-center justify-center shrink-0 overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-full z-10 bg-transparent cursor-pointer"></div>
                      {block.generated_html ? (
                        <iframe
                          srcDoc={block.generated_html}
                          title={`Preview ${block.id}`}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <p className="text-xs text-muted-foreground text-center px-2">
                          {block.title}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Block Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/widget/edit/${block.id}`}>
                        <h3 className="font-medium text-sm">
                          {block.title || "Untitled"}
                        </h3>
                      </Link>
                      {block.status ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {block.html_content?.substring(0, 100) ||
                        "No description"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {formatDate(block.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          editWidget(block);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          serverView(block);
                        }}
                      >
                        Server View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleDeleteWidget(block);
                        }}
                        variant="destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlocksView;
