import {
  Calendar,
  Activity,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "fillinxsolutions-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteCustomBlock } from "@/app/custom-blocks/(hooks)";
import { useRouter } from "next/navigation";

interface widgetCardProps {
  widget: {
    id: string;
    title: string;
    html_content: string;
    css: string;
    js: string;
    head: string;
    height: number;
    created_at: string;
    status: boolean;
    generated_html: any;
  };
  viewMode: "grid" | "list";
  refetchWidgets?: () => void;
}

export function WidgetCard({
  widget,
  viewMode,
  refetchWidgets = () => {},
}: widgetCardProps) {
  const router = useRouter();
  const { handleDeleteBlock } = useDeleteCustomBlock();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusVariant = (status: boolean) => {
    switch (status) {
      case true:
        return "default";
      case false:
        return "secondary";
      default:
        return "secondary";
    }
  };

  //   delete widget
  const handleDeleteWidget = async (widget) => {
    // console.log(widget?.id);

    if (window.confirm("Do you really want to delete thsi widget ??")) {
      try {
        // const response = await delete_api_template({
        //   url: TapdayApiPaths?.customWidgets.deleteById(widget?.id),
        // });
        // setdeletingBlock(true);
        // Navigate first to prevent rendering with undefined block
        // router.push('/');
        await handleDeleteBlock(widget.id);
        // router.refresh();
        await refetchWidgets();
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

  const viewWidget = (widget, e) => {
    const target = e?.target as HTMLElement | null;
    if (
      target &&
      (target.closest('[aria-haspopup="menu"]') ||
        target.closest('[role="menu"]') ||
        target.closest('[role="menuitem"]'))
    ) {
      return;
    }
    // console.log(e.target);
    router.push(`/custom-blocks?selected-block=${widget.id}`);
  };

  if (viewMode === "list") {
    return (
      <div className="flex gap-6 p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-all">
        <div className="flex-shrink-0 w-64 h-48 overflow-hidden rounded-lg bg-gray-950 border border-gray-800">
          <iframe
            id="widgetcardiframe"
            srcDoc={widget.generated_html}
            title={`widget ${widget.id}`}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div
            className="cursor-pointer"
            onClick={(e) => {
              viewWidget(widget, e);
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="mb-2 text-gray-100">
                  {widget.title || "no title"}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(widget.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(widget.status)}>
                  <Activity className="w-3 h-3 mr-1" />
                  {widget.status}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 "
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-900 border-gray-800"
                  >
                    {/* <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem
                      onClick={() => {
                        handleDeleteWidget(widget);
                      }}
                      className="text-red-400 focus:bg-gray-800 focus:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-950 rounded-lg border border-gray-800">
              <p className="text-xs text-gray-500 mb-1">
                HTML Content Preview:
              </p>
              <code className="text-xs text-gray-400 break-all line-clamp-3">
                {widget.html_content.substring(0, 200)}...
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={(e) => {
        viewWidget(widget, e);
      }}
      className="flex flex-col bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
    >
      <div className="relative aspect-video bg-gray-950 overflow-hidden border-b border-gray-800">
        <iframe
          id="widgetcardiframe"
          srcDoc={widget.generated_html}
          title={`widget ${widget.id}`}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
        <Badge
          variant={getStatusVariant(widget.status)}
          className="absolute top-3 right-3"
        >
          <Activity className="w-3 h-3 mr-1" />
          {widget.status}
        </Badge>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-100">{widget.title || "no title"}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 "
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-900 border-gray-800"
            >
              {/* <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem> */}
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                onClick={() => {
                  handleDeleteWidget(widget);
                }}
                className="text-red-400 focus:bg-gray-800 focus:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(widget.created_at)}</span>
        </div>

        <div className="mt-auto p-3 bg-gray-950 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">HTML Content:</p>
          <code className="text-xs text-gray-400 break-all line-clamp-2">
            {widget.html_content.substring(0, 100)}...
          </code>
        </div>
      </div>
    </div>
  );
}
