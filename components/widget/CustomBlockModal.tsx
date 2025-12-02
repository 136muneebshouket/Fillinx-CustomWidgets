// Modal for selecting template or creating a new custom widget
// Best practices: clear separation, props, comments, accessibility
import React from "react";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  useCustomBlocks,
  useTemplateBlocks,
} from "../../hooks/use-custom-blocks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";

interface CustomBlockModalProps {
  open: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onSelectTemplate: (templateId: string) => void;
}

/**
 * Modal for choosing to create a new custom widget or select a template widget.
 * - Shows template widgets as cards (fetched from API).
 * - Handles loading and error states.
 * - Has a button to create a new custom widget (always visible).
 * - Calls appropriate handlers on selection.
 */
const CustomBlockModal: React.FC<CustomBlockModalProps> = ({
  open,
  onClose,
  onCreateNew,
  onSelectTemplate,
}) => {
  // State to toggle between main options and template selection
  const [usingTemplate, setUsingTemplate] = React.useState(false);
  // Fetch template widgets from API
  const { blocks, isLoading, isError } = useCustomBlocks({
    isTemplateWidget: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogTitle className="text-xl font-semibold mb-4">
          {usingTemplate ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 rounded hover:bg-muted transition"
                onClick={() => setUsingTemplate(false)}
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span>Choose a template</span>
            </div>
          ) : (
            "Choose a starting point"
          )}
        </DialogTitle>
        <div className="p-6 w-full">
          {!usingTemplate ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Create New Box */}
              <Card
                className="cursor-pointer flex flex-col items-center justify-center p-8 hover:shadow-lg transition border-2 border-transparent hover:border-primary"
                onClick={onCreateNew}
                tabIndex={0}
                role="button"
                aria-label="Create New Custom Widget"
              >
                <div className="text-3xl mb-2">✨</div>
                <div className="font-semibold text-lg mb-1">Create New</div>
                <div className="text-sm text-muted-foreground text-center">
                  Start from scratch and build your own custom widget.
                </div>
              </Card>
              {/* Use Templates Box */}
              <Card
                className="cursor-pointer flex flex-col items-center justify-center p-8 hover:shadow-lg transition border-2 border-transparent hover:border-primary"
                onClick={() => setUsingTemplate(true)}
                tabIndex={0}
                role="button"
                aria-label="Use Templates"
              >
                <div className="text-3xl mb-2">📦</div>
                <div className="font-semibold text-lg mb-1">Use Templates</div>
                <div className="text-sm text-muted-foreground text-center">
                  Choose from existing template widgets to get started quickly.
                </div>
              </Card>
            </div>
          ) : (
            <div>
              {/* Loading, Error, or Data */}
              <div className="mb-5">
                {isLoading && (
                  <div className="col-span-2 text-center text-muted-foreground">
                    Loading templates...
                  </div>
                )}
                {isError && !isLoading && (
                  <div className="col-span-2 text-center text-red-500">
                    Error loading templates.
                  </div>
                )}
                <div className="space-y-3 h-[200px] overflow-hidden overflow-y-auto">
                  {!isLoading &&
                    !isError &&
                    blocks &&
                    blocks.length > 0 &&
                    blocks.map((template: any) => (
                      <Card
                        key={template.id}
                        className="overflow-hidden p-0 gap-0 cursor-pointer"
                        onClick={() => onSelectTemplate(template.id)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select template ${template.title || template.id}`}
                      >
                        <div className="p-4 flex items-center gap-4">
                          {/* Preview Thumbnail */}
                          <div className="w-40 h-24 bg-muted rounded flex items-center justify-center shrink-0 overflow-hidden">
                            {template.generated_html ? (
                              <iframe
                                srcDoc={template.generated_html}
                                title={`Preview ${template.id}`}
                                className="w-full h-full border-0"
                                sandbox="allow-scripts"
                              />
                            ) : (
                              <p className="text-xs text-muted-foreground text-center px-2">
                                {template.title}
                              </p>
                            )}
                          </div>

                          {/* Block Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm">
                                {template.title || "Untitled"}
                              </h3>
                              {template.status ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {template.html_content?.substring(0, 100) ||
                                "No description"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {formatDate(template.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* No templates found */}
                {!isLoading && !isError && blocks && blocks.length === 0 && (
                  <div className="col-span-2 text-center text-muted-foreground">
                    No template widgets found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBlockModal;

