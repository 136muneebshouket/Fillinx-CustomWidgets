"use client";
import React, { memo, useRef, useState } from "react";
import { useCustomBlockState } from "../(hooks)";
import { CustomBlockType } from "../types";
import Link from "next/link";
import { useSaveButtons } from "@/app/hooks/save-update-hooks";
import { Button } from "@/components/ui/button";
import { toast } from "fillinxsolutions-provider";
import { PencilLine } from "lucide-react";

const Header = ({
  selectedBlock,
  onChangeBlockTitle = () => {},
}: {
  selectedBlock: CustomBlockType;
  onChangeBlockTitle?: (title: string) => void;
}) => {
  const { handleUpdate } = useSaveButtons();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingText, seteditingText] = useState(()=> selectedBlock?.title || 'Custom Block Title');
  const [isEditing, setisEditing] = useState(false);
  const { setState } = useCustomBlockState();

    const handleEdit = () => {
      if (!editingText) {
        return toast.error("Title is required", {
          position: "top-right",
        });
      }
      // handleUpdate();
      // setState((prev) => ({
      //   ...prev,
      //   blocks: prev.blocks.map((block) => {
      //     if (block.id === selectedBlock.id) {
      //       return {
      //         ...block,
      //         title: editingText,
      //       };
      //     }
      //     return block;
      //   }),
      // }));
      onChangeBlockTitle(editingText);
      setisEditing(false);
      // seteditingText("");
    
    }
  return (
    <div className="flex-1  gap-5 w-full flex justify-between items-center">
      <div className="">
        <h2 className="text-xl font-semibold text-white/70 flex items-center gap-2">
          {/* <EditLine
            onClick={() => {
              seteditingText(selectedBlock.title);
              setisEditing(true);
            }}
            className="text-white/70 cursor-pointer"
          />{" "} */}
          {isEditing ? (
            <input
              ref={inputRef}
              className="bg-transparent outline-none border-b border-b-white text-white/70 text-xl font-semibold"
              value={editingText}
              onChange={(e) => {
                seteditingText(e.target.value);
              }}
            />
          ) : (
            <>
              <div
                onClick={() => {
                  setisEditing(true);
                }}
                className="flex gap-2 cursor-pointer text-md"
              >
                <p>{selectedBlock?.title || ""}</p>
                <PencilLine />
              </div>
            </>
          )}
          {isEditing && (
            <>
              <Button
                onClick={()=>{handleEdit()}}
                className="text-xs bg-[#1E1E1E] text-white/70 hover:bg-[#1E1E1E] hover:text-white"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  setisEditing(false);
                  // seteditingText("");
                }}
                variant={"ghost"}
                className="text-xs"
              >
                Cancel
              </Button>
            </>
          )}
        </h2>
      </div>
      <Link
        href={
          "https://band-channel-304.notion.site/Tapday-Developer-Documentation-1b6cdc6c6c2680838195ee7cbcc63260?pvs=4"
        }
        target="_blank"
      >
        {/* <Button variant={"outline"} className="font-roobert-semibold text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="size-4 mr-1"
          >
            <g fill="none">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="currentColor"
                d="M11 6a1 1 0 1 1 0 2H5v11h11v-6a1 1 0 1 1 2 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm9-3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V6.414l-8.293 8.293a1 1 0 0 1-1.414-1.414L17.586 5H15a1 1 0 1 1 0-2Z"
              />
            </g>
          </svg>
          Read Docs
        </Button> */}
      </Link>
    </div>
  );
};

export default memo(Header);
