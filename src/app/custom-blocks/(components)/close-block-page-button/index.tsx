"use client";
import { useSaveButtons } from "@/app/hooks/save-update-hooks";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { AlterationContentModal } from "../modal";
import { ArrowLeft } from 'lucide-react';

export const CloseBlockPageButton = () => {
  const router = useRouter();
  const { isSave, handleReset } = useSaveButtons();
  const [openModal, setopenModal] = useState(false);
  const handleClose = useCallback(() => {
    if (isSave.isSaved) {
      setopenModal(true);
    } else {
      router.push('/');
    }
  }, [isSave.isSaved, router]);
  return (
    <>
      <AlterationContentModal
        open={openModal}
        title={"Warning!"}
        description="Save your changes before you leave. Your Changes will be lost if you leave."
        handleClose={() => {
          setopenModal(false);
        }}
        handleSubmit={() => {
          handleReset();
          router.push('/');
        }}
      />
      <div
        onClick={handleClose}
        role="button"
        className="h-full aspect-[2] flex items-center justify-center gap-2"
      >
        <ArrowLeft className="text-white" size={20} />
        <p className="text-center text-white text-sm font-roobert-semibold">
          Close
        </p>
      </div>
    </>
  );
};
