"use client";
import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Sun,
  Code2,
  Paintbrush,
  FileJson,
  Database,
  Languages,
  FileCode,
  Check,
  ChevronsUpDown,
  X,
  Edit,
  MoreVertical,
  LayoutPanelTop,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useGenerateCustomBlockPreview,
  useCustomBlockState,
  useDeleteCustomBlock,
} from "@/lib/hooks/use-custom-blocks-state";
import { defaultCustomBlockItem } from "@/lib/recoil/custom-blocks-state";
import { toast } from "sonner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, jsToJson, tsToJs, debounce } from "@/lib/utils";
import ShopListDropdown from "./childComponents/ShopListDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import useUnsavedChanges from "@/hooks/unSavedChanges";
import { useSafeNavigation } from "@/hooks/safeNavigation";
import { useDebouncedChange } from "@/hooks/use-debounced-change";
import { useSWRConfig } from "swr";
import { SWRKeys } from "@/lib/api/swr-keys";
import { OnMount } from "@monaco-editor/react";

type EditorTab =
  | "html"
  | "css"
  | "js"
  | "head"
  | "data"
  | "translations"
  | "schema";

// Sample shops data
const shops = [
  { id: "1", name: "Shop 1" },
  { id: "2", name: "Shop 2" },
  { id: "3", name: "Shop 3" },
  { id: "4", name: "Shop 4" },
];

// ADD: props interface for defaults + editMode
type WidgetFormProps = {
  defaults?: any;
  editMode?: boolean;
  isTemplateWidget?: boolean;
};

// CHANGE: function signature to accept props
export default function WidgetForm({
  defaults,
  editMode = false,
  isTemplateWidget = false,
}: WidgetFormProps) {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const { mutate } = useSWRConfig();
  const { generatePreview } = useGenerateCustomBlockPreview();
  const { handleCreateBlock, handleSaveBlocks } = useCustomBlockState();
  const { handleDeleteBlock } = useDeleteCustomBlock();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [saved, setSaved] = useState(true);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<EditorTab>("html");

  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // CHANGE: allow iframe height default via prop
  const [iframeHeight, setIframeHeight] = useState(defaults?.height ?? 300);
  const [iframeWidth, setIframeWidth] = useState(460);

  // Block details
  // CHANGE: initialize from defaults when provided
  const [blockTitle, setBlockTitle] = useState(defaults?.title);
  const [blockDescription, setBlockDescription] = useState(
    defaults?.description ?? ""
  );
  const [blockStatus, setBlockStatus] = useState(defaults?.blockStatus ?? true);

  // Editor content state
  // CHANGE: initialize from defaults when provided, else fallback to current defaults
  const [editorState, setEditorState] = useState({
    html: defaults?.html ?? defaultCustomBlockItem.html,
    css: defaults?.css ?? defaultCustomBlockItem.css,
    js: defaults?.js ?? defaultCustomBlockItem.js,
    head: defaults?.head ?? defaultCustomBlockItem.head,
    data: defaults?.data ?? defaultCustomBlockItem.data,
    translations: defaults?.translations ?? defaultCustomBlockItem.translations,
    schema: defaults?.schema ?? defaultCustomBlockItem.schema,
  });
  // let localEditorState : any = editorState
  const [shopType, setShopType] = useState<"global" | "shop">(
    defaults?.shopType ?? "global"
  );
  const [selectedShops, setSelectedShops] = useState<typeof shops>(
    defaults?.shops ?? []
  );

  // Debounced handlers for editor changes to prevent stuttering/jumping

  // const handleEditorChange = useDebouncedChange((value: any, key: string) =>
  //   setEditorState((prev) => ({ ...prev, [key]: value }))
  // );
  const handleEditorChange = (value: any, key: string) => {
    setEditorState((prev) => ({ ...prev, [key]: value }));
  };

  // Temp state for dialog
  const [tempTitle, setTempTitle] = useState(blockTitle);
  const [tempDescription, setTempDescription] = useState(blockDescription);
  const [tempStatus, setTempStatus] = useState(blockStatus);

  // 1. State to track if the text is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  // State to track whether the margin should be applied
  const [hasMargin, setHasMargin] = useState(true);
  // 2. Function to toggle the expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  // console.log(blockDescription.split("\n").length > 3);

  // Define the max height for the collapsed state
  const maxHeight = "4.5rem"; // Example: 3 lines @ 1.5rem line-height

  // track unsaved changes //////////////
  useUnsavedChanges(!saved);
  // Add router.push protection
  const { safePush } = useSafeNavigation(!saved);

  useEffect(() => {
    const isDirty =
      defaults.html != editorState.html ||
      defaults.css != editorState.css ||
      defaults.js != editorState.js ||
      defaults.data != editorState.data ||
      defaults.translations != editorState.translations ||
      defaults.schema != editorState.schema ||
      defaults.shopType != shopType ||
      defaults.title != blockTitle ||
      defaults.status != blockStatus ||
      defaults.description != blockDescription ||
      defaults.shops != selectedShops;

    setSaved(!isDirty);
  }, [
    defaults,
    editorState.html,
    editorState.css,
    editorState.js,
    editorState.data,
    editorState.translations,
    editorState.schema,
    shopType,
    selectedShops,
    blockTitle,
    blockStatus,
    blockDescription,
  ]);

  // console.log(saved);

  useEffect(() => {
    if (!iframeRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        setIframeWidth(newWidth);
        // console.log("Width:", newWidth);
      }
    });

    observer.observe(iframeRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Listen to iframe messages for dynamic height
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const messageData = event.data;
      if (messageData.action === "resize" && messageData.height) {
        setIframeHeight(Number(messageData.height));
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  //   const tsCode: string = `
  //   export type FileArgument = string | Buffer;

  //   function main(file: FileArgument) {
  //     console.log('Hello world!', file);
  //   }
  // `;

  // const compiledJsCode: string = compile(tsCode);
  // console.log(compiledJsCode);

  // const tsCode = `const greeting: string = "Hello"; console.log(greeting);`;

  // const dataJS = tsToJs(data || "");

  const handleSave = useCallback(async () => {
    const bodyHeight =
      iframeRef.current?.contentWindow?.document.body.scrollHeight ?? 0;

    const generated_html = generatePreview(editorState);

    // console.log(translations)

    // const dataJS = tsToJs(editorState.data || "", true);
    // const translationsJS = tsToJs(editorState.translations || "", true);
    // const schemaJS = tsToJs(editorState.schema || "", true);

    // console.log(dataJS)
    // console.log(translationsJS);
    // console.log(schemaJS)

    // console.log({
    //   ...editorState,
    //   title: blockTitle,
    //   generated_html,
    //   height: bodyHeight,
    //   shopType,
    //   shops: selectedShops,
    //   status: blockStatus,
    // });

    // return;

    if (saving) {
      return;
    }

    setSaved(true);

    try {
      setSaving(true);

      const bodyData = {
        ...editorState,
        title: tempTitle,
        description: tempDescription,
        generated_html,
        height: bodyHeight,
        shopType,
        shops: selectedShops,
        status: tempStatus,
        created_at: editMode ? defaults?.created_at : new Date(),
        isTemplateWidget: isTemplateWidget,
      };

      if (!editMode) {
        await handleCreateBlock(bodyData);
        router.push("/");
      } else {
        await handleSaveBlocks({
          blockData: bodyData,
          selectedBlockId: defaults.id,
        });
      }

      // CHANGE: toast message reflects editMode
      toast.success(
        editMode
          ? "Custom block updated successfully"
          : "Custom block created successfully"
      );
    } catch (error) {
      toast.error("Failed to create custom block");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [
    editorState,
    saving,
    tempTitle,
    tempDescription,
    shopType,
    selectedShops,
    tempStatus,
    editMode,
    defaults,
    isTemplateWidget,
    handleCreateBlock,
    handleSaveBlocks,
    router,
  ]);

  const previewHtml = generatePreview(editorState);

  //   console.log(iframeHeight);
  const handleSaveRef = useRef(handleSave);

  // Update ref whenever handleSave changes
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const listenToIframeMessages = (event: any) => {
    // Verify the source of the message
    console.log(event.origin, window.location.origin);
    if (event.origin !== window.location.origin) {
      // Ensure message is coming from the expected origin
      return;
    }

    // Handle the data from the iframe
    const messageData = event.data;
    console.log("Received message from iframe:", messageData);

    // You can perform any actions based on the data received
    if (messageData.action === "resize") {
      // alert(messageData.height)
      // Example: Resize iframe based on data
      if (messageData?.height) {
        setIframeHeight(Number(messageData.height));
      }
    }
  };
  const handleKeyDown = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      // handle async function
      e.preventDefault();
      if (!saving) {
        await handleSaveRef.current();
      }
    }
  };

  // Register the message event listener when the component mounts
  useEffect(() => {
    window.addEventListener("message", listenToIframeMessages);
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener("message", listenToIframeMessages);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave, saving, handleKeyDown]);

  const SCHEMA_OBJECT = `{
    settingType: "",
    type: "",
    label: "",
    value: ""
  }`;

  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any, startLine: number, endLine: number) => {
      // Check if the real monaco editor and API are present
      if (editor.deltaDecorations) {
        editorRef.current = editor;
        monacoRef.current = monaco;
        // NOTE: Monaco uses 1-based indexing for lines and columns.
        const READ_ONLY_RANGE = {
          startLineNumber: startLine,
          startColumn: 1,
          endLineNumber: endLine, // Go up to the start of the comment line
          endColumn: 1,
        };

        // Apply a visual decoration and contextual data to the read-only range
        editor.deltaDecorations(
          [], // clear previous decorations
          [
            {
              range: new monaco.Range(
                READ_ONLY_RANGE.startLineNumber,
                READ_ONLY_RANGE.startColumn,
                READ_ONLY_RANGE.endLineNumber,
                READ_ONLY_RANGE.endColumn
              ),
              options: {
                isWholeLine: true,
                className: "read-only-background", // Custom class for styling
                // This context key is used by Monaco to prevent edits
                inlineClassName: "monaco-read-only-section",
                hoverMessage: { value: "This section is read-only." },
              },
            },
          ]
        );

        // --- ENFORCEMENT LOGIC: Block edits within the read-only range ---
        editor.onDidChangeModelContent((event: any) => {
          const { changes } = event;
          const readOnlyMonacoRange = new monaco.Range(
            READ_ONLY_RANGE.startLineNumber,
            READ_ONLY_RANGE.startColumn,
            READ_ONLY_RANGE.endLineNumber,
            READ_ONLY_RANGE.endColumn
          );

          // We use the real monaco API here if it exists.
          const isEditingReadOnly = changes.some(
            (change: any) =>
              (monaco as any).Range.intersectRanges(
                readOnlyMonacoRange,
                (monaco as any).Range.lift(change.range)
              ) !== null
          );

          if (isEditingReadOnly) {
            editor.trigger("source", "undo", null);
            // setStatus("🛑 Edit Blocked: The interface definition is read-only.");
          } else {
            // setStatus("Editing user code...");
          }
        });
      } else {
        // setStatus("⚠️ Failed to load Monaco Editor. Check dependency resolution.");
      }

      // // for actions /////////////////////////////////
      // editor.addAction({
      //   id: "add-schema-object",
      //   label: "Add schema object",
      //   contextMenuGroupId: "navigation",
      //   contextMenuOrder: 0,

      //   run: () => {
      //     const position = editor.getPosition(); // current cursor location
      //      if (!position) return; // safety
      //     const range = new monaco.Range(
      //       position.lineNumber,
      //       position.column,
      //       position.lineNumber,
      //       position.column
      //     );

      //     editor.executeEdits("insert-schema-object", [
      //       {
      //         range,
      //         text: SCHEMA_OBJECT + ",\n",
      //         forceMoveMarkers: true
      //       }
      //     ]);
      //   }
      // });

      // Bind CTRL/CMD + S
      // editor.addCommand(
      //   monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      //   async () => {
      //     console.log("CTRL+S pressed!");
      //     console.log(saving)
      //     if (!saving) {
      //       await handleSave();
      //     }
      //     // mySaveFunction(); // <-- call your function here
      //   }
      // );
    },
    []
  );

  // --- FUNCTION FACTORY: Returns the onMount function with enclosed line numbers ---
  const readonlyLinesHandler = useCallback(
    (startLine: number, endLine: number) => (editor: any, monaco: any) => {
      // This function is the actual onMount handler passed to the Editor component
      handleEditorDidMount(editor, monaco, startLine, endLine);
    },
    [handleEditorDidMount]
  );

  // delete block
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
        router.push("/");
      } catch (error) {
        toast.error("Something went wrong, try again later", {
          position: "top-right",
        });
      } finally {
        // setdeletingBlock(false);
      }
    }
  };

  //   console.log(selectedShops)

  return (
    <div className="h-screen flex flex-col">
      {/* Header - Same as home page */}
      <header className="border-b px-6 h-14 flex items-center justify-between">
        {/* Logo + Page Name */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => safePush("/")}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-7 h-7 rounded bg-foreground flex items-center justify-center">
            <span className="text-background font-semibold text-xs">TB</span>
          </div>
          <h1 className="text-base font-medium">Custom Blocks</h1>
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 h-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Editor */}
          <ResizablePanel defaultSize={70} className="h-full">
            <div className="h-full flex flex-col overflow-hidden">
              {/* Editor Header with Tabs */}
              <div className="border-b p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div>
                      <div className="flex gap-2">
                        <h2 className="text-lg font-semibold">{blockTitle}</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTempTitle(blockTitle);
                            setTempDescription(blockDescription);
                            setTempStatus(blockStatus);
                            setEditDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* 3. The description element with conditional styling */}
                      <p
                        className={`
          text-sm text-muted-foreground mt-1 cursor-pointer transition-all duration-300 ease-in-out 
          ${
            isExpanded ? "whitespace-normal overflow-visible" : "truncate-lines"
          }
        `}
                        style={
                          isExpanded
                            ? {} // No max height when expanded
                            : { maxHeight: maxHeight } // Apply max height when collapsed
                        }
                        onClick={toggleExpand}
                      >
                        {blockDescription || "Create your custom block"}
                      </p>
                      {/* Optional: Add a visual indicator for expansion
                        {blockDescription && ( // Simple check for potential overflow
                          <button
                            onClick={toggleExpand}
                            className="text-xs text-blue-500 hover:text-blue-700 mt-1 cursor-pointer"
                          >
                            {isExpanded ? "Show Less" : "Show More"}
                          </button>
                        )} */}
                    </div>
                  </div>
                  {isTemplateWidget ? (
                    <div className="flex items-center text-blue-400 text-sm gap-2">
                      <LayoutPanelTop />
                      <p>Remember you are creating a Template widget</p>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    {/* Shop Type Selector */}
                    <select
                      style={{ display: isTemplateWidget ? "none" : "block" }}
                      className="px-2 py-1 text-xs border rounded-md bg-background w-20 h-7"
                      value={shopType}
                      disabled={isTemplateWidget || false}
                      onChange={(e) => {
                        setShopType(e.target.value as "global" | "shop");
                        if (e.target.value === "global") {
                          setSelectedShops([]);
                        }
                      }}
                    >
                      <option value="global">Global</option>
                      <option value="shop">Shop</option>
                    </select>

                    {/* Multi-Select Shop Combobox */}
                    {shopType === "shop" && (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-24 justify-between text-xs relative h-7 px-2"
                          >
                            Shops
                            <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                            {/* Shop Count Badge */}
                            {selectedShops.length > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-primary-foreground bg-primary rounded-full border-2 border-background">
                                {selectedShops.length}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <ShopListDropdown
                          selectedShops={selectedShops}
                          setSelectedShops={setSelectedShops}
                        />
                      </Popover>
                    )}

                    {/* Divider */}
                    <div className="h-6 w-px bg-border mx-1" />

                    {/* Save Button */}
                    <Button
                      size="sm"
                      className="h-7 text-xs px-3"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {/* CHANGE: button label reflects editMode */}
                      {saving ? "Saving..." : editMode ? "Update" : "Save"}
                    </Button>

                    {/* More Options Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {editMode && (
                          <DropdownMenuItem
                            onClick={() => {
                              handleDeleteWidget(defaults);
                            }}
                            variant="destructive"
                          >
                            Delete Block
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Code Type Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as EditorTab)}
                >
                  <TabsList className="!w-fit justify-start bg-transparent h-auto p-0 flex-wrap gap-2">
                    <TabsTrigger
                      value="html"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      HTML
                    </TabsTrigger>
                    <TabsTrigger
                      value="css"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <Paintbrush className="w-3.5 h-3.5" />
                      CSS
                    </TabsTrigger>
                    <TabsTrigger
                      value="js"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      JS
                    </TabsTrigger>
                    <TabsTrigger
                      value="head"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      HEAD
                    </TabsTrigger>
                    <TabsTrigger
                      value="data"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5" />
                      DATA
                    </TabsTrigger>
                    <TabsTrigger
                      value="translations"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      TRANSLATIONS
                    </TabsTrigger>
                    <TabsTrigger
                      value="schema"
                      className="!p-2.5 !w-fit text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      SCHEMA
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Editor Content */}
              <div className="relative flex-1 overflow-hidden min-h-0 border-2 border-muted-foreground/20 rounded-md m-4">
                <div
                  style={{ display: activeTab === "html" ? "block" : "none" }}
                  className="absolute h-full inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="html"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    defaultValue={editorState.html}
                    onChange={(value) => {
                      handleEditorChange(value, "html");
                    }}
                    onMount={readonlyLinesHandler(0, 0)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
                {/* {activeTab === "html" && (
                
                )} */}
                <div
                  style={{ display: activeTab === "css" ? "block" : "none" }}
                  className="absolute inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="css"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    defaultValue={editorState.css}
                    onChange={(value) => {
                      handleEditorChange(value, "css");
                    }}
                    onMount={readonlyLinesHandler(0, 0)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
                {/* {activeTab === "css" && (
                 
                )} */}
                <div
                  style={{ display: activeTab === "js" ? "block" : "none" }}
                  className="absolute inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="javascript"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    defaultValue={editorState.js}
                    onChange={(value) => {
                      handleEditorChange(value, "js");
                    }}
                    onMount={readonlyLinesHandler(0, 0)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
                {/* {activeTab === "js" && (
                 
                )} */}
                <div
                  style={{ display: activeTab === "head" ? "block" : "none" }}
                  className="absolute inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="html"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    defaultValue={editorState.head}
                    onChange={(value) => {
                      handleEditorChange(value, "head");
                    }}
                    onMount={readonlyLinesHandler(0, 0)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
                {/* {activeTab === "head" && (
                
                )} */}
                <div
                  style={{ display: activeTab === "data" ? "block" : "none" }}
                  className="absolute inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="typescript"
                    defaultValue={editorState.data}
                    onChange={(value) => {
                      handleEditorChange(value, "data");
                    }}
                    onMount={readonlyLinesHandler(1, 11)}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
                {/* {activeTab === "data" && (
                
                )} */}
                <div
                  style={{
                    display: activeTab === "translations" ? "block" : "none",
                  }}
                  className="absolute inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="typescript"
                    defaultValue={editorState.translations}
                    onChange={(value) => {
                      handleEditorChange(value, "translations");
                    }}
                    onMount={readonlyLinesHandler(1, 10)}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
                {/* {activeTab === "translations" && (
                 
                )} */}
                <div
                  style={{ display: activeTab === "schema" ? "block" : "none" }}
                  className="absolute inset-0"
                >
                  <MonacoEditor
                    className="h-full"
                    height="100%"
                    language="typescript"
                    defaultValue={editorState.schema}
                    onChange={(value) => {
                      handleEditorChange(value, "schema");
                    }}
                    onMount={readonlyLinesHandler(1, 12)}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "off",
                      formatOnType: false,
                      formatOnPaste: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Preview */}
          <ResizablePanel defaultSize={30}>
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="border-b p-4 flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-semibold">Preview</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Live preview
                  </p>
                </div>
                <div className="flex flex-row gap-4">
                  <div>
                    <p className="text-sm text-slate-400">
                      Width : {iframeWidth ? iframeWidth.toFixed(2) : ""} px
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="margin-toggle"
                      checked={hasMargin}
                      onCheckedChange={(checked: any) => setHasMargin(checked)}
                      className="border border-slate-400 opacity-100"
                    />
                    <Label
                      htmlFor="margin-toggle"
                      className="cursor-pointer text-sm"
                    >
                      Apply margin
                    </Label>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div
                className={
                  "flex-1 overflow-auto" + " " + `${hasMargin ? "p-6" : "p-0"}`
                }
              >
                {/* <motion.iframe
                  initial={{ height: iframeHeight }}
                  animate={{ height: iframeHeight }}
                  onLoad={() => {
                    if (iframeRef.current) {
                      setIframeHeight(
                        iframeRef.current?.contentWindow?.document?.body
                          ?.scrollHeight ?? 0
                      );
                    }
                  }}
                  ref={iframeRef}
                  //   className="w-full border rounded-lg bg-white"
                  //   style={{ height: `${iframeHeight}px` }}
                  className="w-full overflow-scroll"
                  title="Preview"
                  srcDoc={}
                  sandbox="allow-scripts allow-same-origin"
                /> */}

                <iframe
                  ref={iframeRef}
                  className="w-full border overflow-scroll"
                  style={{ height: `${iframeHeight}px` }}
                  title="Preview"
                  srcDoc={previewHtml}
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={() => {
                    if (iframeRef.current) {
                      const height =
                        iframeRef.current?.contentWindow?.document?.body
                          ?.scrollHeight ?? 300;
                      setIframeHeight(height);
                    }
                  }}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Edit Block Details Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Block Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Enter block title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                placeholder="Enter block description"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Active Status</Label>
              <Switch
                id="status"
                checked={tempStatus}
                onCheckedChange={setTempStatus}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setBlockTitle(tempTitle);
                setBlockDescription(tempDescription);
                setBlockStatus(tempStatus);
                setEditDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}