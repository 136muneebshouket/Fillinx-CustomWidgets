"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { ProductModal } from "./product-modal";
import {
  CustomBlockTabsEnums,
  CustomBlockProductType,
  CustomBlockType,
} from "./types";
import {
  useCustomBlockState,
  useDeleteCustomBlock,
  useGenerateCustomBlockPreview,
} from "./(hooks)";
import Header from "./(components)/header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "fillinxsolutions-provider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { CloseBlockPageButton } from "./(components)/close-block-page-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSaveButtons } from "../hooks/save-update-hooks";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ProductSelectionModal } from "./(components)/product-selection-modal";
import { CollectionSelectionModal } from "./(components)/collection-selection-modal";
import CustomTabs from "@/components/ui/customtabs";
import { cn } from "@/lib/utils";
import TapDayLogo from "@/components/SVGS/TapDayLogo";
import { upload_api_template_fn } from "@/lib/API/ApiTemplates";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";
import { getallWidgets_swrKey } from "@/lib/API/SWR-RevalidationKeys";
import { useSWRConfig } from "swr";
import { SelectShopForWidget } from "./(components)/ShopSelection/SelectShopForWidget";
// import { CloseBlockPageButton } from './(components)/close-block-page-button'

interface Props {
  selectedBlock: CustomBlockType;
  creatingNewBlock?: boolean;
}
export const CustomBlockPage = ({
  selectedBlock,
  creatingNewBlock = false,
}: Props) => {
  const { generatePreview } = useGenerateCustomBlockPreview();
  const [iframeClientHeight, setiframeClientHeight] = useState(0);
  const [saving, setsaving] = useState(false);
  const [openDeleteModal, setopenDeleteModal] = useState(false);
  const [deletingBlock, setdeletingBlock] = useState(false);
  const [selectedTab, setSelectedTab] = useState<CustomBlockTabsEnums>(
    CustomBlockTabsEnums.HTML
  );
  const [newBlock, setNewBlock] = useState(selectedBlock);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setState, handleSaveBlocks } = useCustomBlockState();
  const { handleDeleteBlock } = useDeleteCustomBlock();
  const { mutate } = useSWRConfig();
  let state = creatingNewBlock ? newBlock : selectedBlock;
  // console.log(state)
  // const [openCollectionModal, setopenCollectionModal] = useState(false);
  // temporary product storage for product property selection
  // const [tempProduct, settempProduct] = useState<CustomBlockProductType | null>(
  //   null
  // );
  const { handleUpdate, isSave, handleReset } = useSaveButtons();

  // const [openModal, setopenModal] = useState(false);
  // const [selectedModel, setselectedModel] = useState<any>();
  // const [selectedPosition, setselectedPosition] = useState<any>();

  const editorRef = useRef<any>(null);
  const htmlEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;

    // editor.addAction({
    //   id: "show-products-selection-modal",
    //   label: "🖱️ Shopify Products",
    //   contextMenuGroupId: "1_modification",
    //   contextMenuOrder: 0,
    //   run: (editor) => {
    //     const selection = editor.getSelection();
    //     const model = editor.getModel();
    //     if (selection && model) {
    //       setselectedModel(model);
    //       setselectedPosition(selection);
    //       setopenModal(true);
    //     }
    //   },
    // });
    // editor.addAction({
    //   id: "show-collections-selection-modal",
    //   label: "❖ Shopify Collections",
    //   contextMenuGroupId: "1_modification",
    //   contextMenuOrder: 1,
    //   run: (editor) => {
    //     const selection = editor.getSelection();
    //     const model = editor.getModel();
    //     if (selection && model) {
    //       setselectedModel(model);
    //       setselectedPosition(selection);
    //       setopenCollectionModal(true);
    //     }
    //   },
    // });
  }, []);

  const handleSaveBlock = useCallback(async () => {
    // setIsSave((prev) => ({ ...prev, isSaved: false }))

    let bodyHeight =
      iframeRef.current?.contentWindow?.document.body.scrollHeight ?? 0;

    // console.log(state);
    // return

    mutate(getallWidgets_swrKey);

    if (creatingNewBlock) {
      let bodyObj = {
        title: state.title,
        type: "templateBlocks",
        shopType: state.shopType || "global", // global , byIds
        shops: state.shops,
        html_content: state.html,
        generated_html: generatePreview({
          css: state.css,
          head: state.head,
          html: state.html,
          js: state.js,
          data: state.data,
          translations: state.translations,
          tagStyles: state.tagStyles,
        }),
        css_content: state.css,
        js_content: state.js,
        head: state.head,
        height: bodyHeight?.toString() || "",
        data: state.data || "", //  type: 'templateBlocks' this needs to be added otherwise app will break
        translations: state.translations || "",
        tagStyles: state.tagStyles || "",
      };

      try {
        const response = await upload_api_template_fn({
          url: TapdayApiPaths?.customWidgets.create(),
          payload: bodyObj,
        });
        // console.log(response);
        router.push(`/`);
        // let widgetId = response?.data ? response?.data?.id : null;
        // if (widgetId) {
        //   // router.push(`/custom-blocks?selected-block=${widgetId}`);
        // }
        toast.success("Custom block created successfully", {
          position: "top-right",
        });
      } catch (error) {
        toast.error((error as any)?.message, {
          position: "top-right",
        });
      }

      // console.log(JSON.stringify(bodyObj));
      return;
    }

    // console.log(state)
    // return
    try {
      setsaving(true);
      // const bodyHeight =
      //   iframeRef.current?.contentWindow?.document.body.scrollHeight ?? 0;

      await handleSaveBlocks({
        height: bodyHeight,
        selectedBlckId: state.id,
        generatedHtml: generatePreview({
          css: state.css,
          head: state.head,
          html: state.html,
          js: state.js,
          data: state.data,
          translations: state.translations,
          tagStyles: state.tagStyles,
        }),
      });

      handleReset();
      toast.success("Custom block saved successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Something went wrong, try again later", {
        position: "top-right",
      });
    } finally {
      setsaving(false);
    }
  }, [
    generatePreview,
    handleSaveBlocks,
    handleReset,
    state.css,
    state.head,
    state.html,
    state.id,
    state.js,
  ]);

  const router = useRouter();
  // console.log('generate preview--->', generatePreview())

  const deleteBlock = useCallback(async () => {
    try {
      mutate(getallWidgets_swrKey);
      setdeletingBlock(true);
      // Navigate first to prevent rendering with undefined block
      router.push("/");
      await handleDeleteBlock(state.id);
      toast.success("Block deleted successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Something went wrong, try again later", {
        position: "top-right",
      });
    } finally {
      setdeletingBlock(false);
    }
  }, [handleDeleteBlock, router, state.id]);

  const listenToIframeMessages = (event: any) => {
    // Verify the source of the message
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
        setiframeClientHeight(Number(messageData.height));
      }
    }
  };

  // Register the message event listener when the component mounts
  useEffect(() => {
    window.addEventListener("message", listenToIframeMessages);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener("message", listenToIframeMessages);
    };
  }, []);

  // funcytion to handle values change in each  tab
  const handleChangeMonaco = (value, key) => {
    // console.log(value);
    // console.log(typeof value);
    handleUpdate();
    if (creatingNewBlock) {
      setNewBlock((prev) => ({
        ...prev,
        [key]: value || "",
      }));
      return;
    } else {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) => {
          if (block.id === state.id) {
            return {
              ...block,
              [key]: value || "",
            };
          }
          return block;
        }),
      }));
    }
  };

  //  function to handle title change of block
  const handleTitleChange = (value) => {
    // console.log(value)
    // return
    handleUpdate();
    if (creatingNewBlock) {
      setNewBlock((prev) => ({
        ...prev,
        title: value || "",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) => {
          if (block.id === state.id) {
            return {
              ...block,
              title: value || "",
            };
          }
          return block;
        }),
      }));
    }
  };

  const convertStringTojs = (val) => {
    if (val) {
      let parse = JSON.parse(JSON.stringify(val));
      // console.log(parse);
      return parse;
    } else {
      return "";
    }

    // return val
  };

  const handleTagChange = (newTag: string) => {
    // console.log(newTag);

    if (creatingNewBlock) {
      setNewBlock((prev) => ({
        ...prev,
        shopType: newTag || null,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) => {
          if (block.id === state.id) {
            return {
              ...block,
              shopType: newTag || null,
            };
          }
          return block;
        }),
      }));
    }
    // toast.info(`Environment changed to: ${newTag}`)
  };

  const handleShopsChange = (selectedShops) => {
    // console.log(selectedShops);

    if (creatingNewBlock) {
      setNewBlock((prev) => ({
        ...prev,
        shops: selectedShops || null,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) => {
          if (block.id === state.id) {
            return {
              ...block,
              shops: selectedShops || null,
            };
          }
          return block;
        }),
      }));
    }
    // setShops(selectedShops)
    // if (selectedShops.length > 0) {
    //   toast.success(`${selectedShops.length} shop(s) selected`)
  };

  return (
    <>
      {/* <Button
        onClick={() => {
          const html = generatePreview({
            css: state.css,
            data: state.data,
            head: state.head,
            html: state.html,
            js: state.js
          })
          navigator.clipboard.writeText(html)
        }}
      >
        Save
      </Button> */}
      <Dialog open={openDeleteModal}>
        <DialogContent className="lg:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-2">Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              custom block.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-end">
            <Button
              onClick={() => {
                setopenDeleteModal(false);
              }}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button onClick={deleteBlock} variant={"destructive"}>
              {deletingBlock && <Loader className="w-4 h-4 mr-2" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* {JSON.stringify({ generatePreview })} */}
      {/* <Button
        onClick={() => {
          const iframeHeight =
            iframeRef.current?.contentWindow?.document.body.scrollHeight
          alert(iframeHeight)
          navigator.clipboard.writeText(generatePreview)
        }}
      >
        Copy
      </Button> */}
      {/* {openModal && (
        <ProductSelectionModal
          isCustomBlockSelection
          open={openModal}
          setOpen={setopenModal}
          onProductSelect={(value) => {
            settempProduct({ ...value, type: "product" } as any);
            setopenModal(false);
          }}
        />
      )}
      {openCollectionModal && (
        <CollectionSelectionModal
          isCustomBlockSelection
          open={openCollectionModal}
          setOpen={setopenCollectionModal}
          onProductSelect={(value) => {
            settempProduct({ ...value, type: "collection" } as any);
            setopenCollectionModal(false);
          }}
        />
      )}
      {tempProduct && (
        <ProductModal
          product={tempProduct as any}
          open={!!tempProduct}
          setClose={(data) => {
            if (data) {
              const product = data.product;
              const stringTobeReplaced = data.replaceableString;
              if (selectedPosition && selectedModel) {
                editorRef?.current?.executeEdits("custom-action", [
                  {
                    range: selectedPosition,
                    text: `${stringTobeReplaced}`,
                    forceMoveMarkers: true,
                  },
                ]);
                if (product.type === "product") {
                  setState((prev) => ({
                    ...prev,
                    blocks: prev.blocks.map((block) => {
                      if (block.id === state.id) {
                        return {
                          ...block,
                          data: {
                            ...block.data,
                            products: {
                              ...block.data.products,
                              [product.id.toString()]: product,
                            },
                          },
                        };
                      }
                      return block;
                    }),
                  }));
                } else {
                  setState((prev) => ({
                    ...prev,
                    blocks: prev.blocks.map((block) => {
                      if (block.id === state.id) {
                        return {
                          ...block,
                          data: {
                            ...block.data,
                            collections: {
                              ...block.data.collections,
                              [product.id.toString()]: product,
                            },
                          },
                        };
                      }
                      return block;
                    }),
                  }));
                }
              }
            }
            settempProduct(null);
          }}
        />
      )} */}
      <div className="h-screen overflow-hidden bg-black flex flex-col">
        <div className="h-full flex gap-2 w-full">
          {/* tabs section */}

          <ResizablePanelGroup
            direction="horizontal"
            className="w-full  border border-slate-800"
          >
            <ResizablePanel defaultSize={70}>
              <div className="flex-grow h-full flex flex-col w-full gap-2 border-r border-slate-800">
                <div className="h-[60px]  mb-2 flex gap-2 border-b border-slate-800">
                  <CloseBlockPageButton />
                  <div className="relative h-full flex-1 bg-transparent flex justify-end items-center px-2.5">
                    <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] flex gap-2  items-center">
                      {/* <Image
                    height={25}
                    width={25}
                    src={"/favicon_io/android-chrome-192x192.png"}
                    alt=""
                  /> */}
                      <TapDayLogo className="w-5 h-5 bg-blue-700" />
                      <p className="text-white font-roobert-semibold text-2xl tracking-wider">
                        CUSTOM BLOCKS
                      </p>
                    </div>
                    <div className="space-x-2 flex flex-row items-center">
                      <Button
                        onClick={handleSaveBlock}
                        className="text-sm"
                        size={"sm"}
                        disabled={!isSave.isSaved || saving}
                      >
                        {saving && <Loader className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          setopenDeleteModal(true);
                        }}
                        className="text-sm"
                        size={"sm"}
                        disabled={creatingNewBlock || saving || deletingBlock}
                      >
                        {deletingBlock && <Loader className="w-4 h-4 mr-2" />}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="px-2.5">
                  <div className="mb-2 flex justify-between items-center">
                    <Header
                      selectedBlock={state}
                      onChangeBlockTitle={(title) => {
                        handleTitleChange(title);
                      }}
                    />
                    <div className="w-[300px]">
                      <SelectShopForWidget
                        onTagChange={handleTagChange}
                        onShopsChange={handleShopsChange}
                        defaultShops={
                          [
                            // { id: 377, name: "accuspot" },
                            // { id: 241, name: "Adaans" },
                          ]
                        }
                        defaultTag={"global"}
                      />
                    </div>
                  </div>
                  <CustomTabs
                    ref={undefined}
                    outerClassName="w-full flex justify-start bg-black border border-[#1E1E1E] rounded-md mt-0"
                    activeTabClassName={cn("bg-white")}
                    motionClassName="bg-white !shrink-0 z-10"
                    textClassName="text-white z-10"
                    tabValues={[
                      { label: "HTML", value: "html", link: "" },
                      { label: "CSS", value: "css", link: "" },
                      { label: "JS", value: "js", link: "" },
                      { label: "HEAD", value: "head", link: "" },
                      { label: "DATA", value: "data", link: "" },
                      {
                        label: "TRANSLATIONS",
                        value: "translations",
                        link: "",
                      },
                      {
                        label: "TAG STYLES",
                        value: "tagStyles",
                        link: "",
                      },
                    ]}
                    active={selectedTab}
                    isRoute={false}
                    onClick={(value) => {
                      setSelectedTab(value as CustomBlockTabsEnums);
                    }}
                  />
                </div>
                <div className="flex-1 overflow-hidden min-h-0 border border-slate-800 rounded-md mx-2.5 mb-3">
                  {selectedTab === CustomBlockTabsEnums.HTML && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="html"
                      theme="vs-dark"
                      value={state.html}
                      options={{ minimap: { enabled: false } }}
                      onMount={htmlEditorDidMount}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         html: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "html");
                      }}
                    />
                  )}
                  {selectedTab === CustomBlockTabsEnums.HEAD && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="html"
                      theme="vs-dark"
                      value={state.head}
                      options={{ minimap: { enabled: false } }}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         head: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "head");
                      }}
                    />
                  )}
                  {selectedTab === CustomBlockTabsEnums.CSS && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="css"
                      theme="vs-dark"
                      value={state.css}
                      options={{ minimap: { enabled: false } }}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         css: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "css");
                      }}
                    />
                  )}
                  {selectedTab === CustomBlockTabsEnums.JS && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="javascript"
                      theme="vs-dark"
                      value={state.js}
                      options={{ minimap: { enabled: false } }}
                      onMount={htmlEditorDidMount}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         js: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "js");
                      }}
                    />
                  )}

                  {selectedTab === CustomBlockTabsEnums.DATA && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="json"
                      theme="vs-dark"
                      value={state.data || ""}
                      options={{ minimap: { enabled: false } }}
                      onMount={htmlEditorDidMount}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         js: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "data");
                      }}
                    />
                  )}

                  {selectedTab === CustomBlockTabsEnums.TRANSLATIONS && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="json"
                      theme="vs-dark"
                      value={state.translations || ""}
                      options={{ minimap: { enabled: false } }}
                      onMount={htmlEditorDidMount}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         js: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "translations");
                      }}
                    />
                  )}

                  {selectedTab === CustomBlockTabsEnums.TAGSTYLES && (
                    <MonacoEditor
                      className="h-full"
                      height="100%"
                      language="json"
                      theme="vs-dark"
                      value={state.tagStyles || ""}
                      options={{ minimap: { enabled: false } }}
                      onMount={htmlEditorDidMount}
                      onChange={(value) => {
                        // handleUpdate();
                        // setState((prev) => ({
                        //   ...prev,
                        //   blocks: prev.blocks.map((block) => {
                        //     if (block.id === state.id) {
                        //       return {
                        //         ...block,
                        //         js: value || "",
                        //       };
                        //     }
                        //     return block;
                        //   }),
                        // }));
                        handleChangeMonaco(value, "tagStyles");
                      }}
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30}>
              {/* preview */}
              <div className="h-full shrink-0 w-full flex flex-col gap-2 p-2">
                <div className="h-[60px]  mb-2  gap-2 flex flex-col justify-center items-center">
                  <p className="text-white text-xs font-roobert-semibold">
                    Preview
                  </p>
                </div>
                <div className="flex-1 !overflow-auto rounded-sm border border-slate-800">
                  <motion.iframe
                    initial={{ height: iframeClientHeight }}
                    animate={{ height: iframeClientHeight }}
                    onLoad={() => {
                      if (iframeRef.current) {
                        // alert(
                        //   iframeRef.current?.contentWindow?.document?.body
                        //     ?.scrollHeight ?? 0
                        // )
                        setiframeClientHeight(
                          iframeRef.current?.contentWindow?.document?.body
                            ?.scrollHeight ?? 0
                        );
                      }
                    }}
                    ref={iframeRef}
                    className="w-full overflow-scroll"
                    title="Preview"
                    srcDoc={generatePreview({
                      css: state.css,
                      head: state.head,
                      html: state.html,
                      js: state.js,
                      data: state.data,
                      translations: state.translations,
                      tagStyles: state.tagStyles,
                    })}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
};
