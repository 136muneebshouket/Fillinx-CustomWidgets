"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  handleClose: () => void;
  title: string;
  description: string;
  disableContinue: boolean;
  handleContinue: () => void;
}
export const ModalHeader = ({
  handleClose,
  description,
  title,
  disableContinue,
  handleContinue,
}: Props) => {
  return (
    <div
      className={cn(
        "flex md:flex-row flex-col justify-between gap-5 w-full p-8 border-b h-max"
      )}
    >
      <div>
        <p className="border-none font-roobert-regular text-[20px]">{title}</p>

        <span className=" my-4 font-roobert-regular text-secondary-dark text-sm">
          {description}
        </span>
      </div>

      <div className="flex space-x-5">
        <Button
          onClick={handleClose}
          type="button"
          className="px-10 py-6 w-fit bg-red-600 font-roobert-regular hover:opacity-[0.9] hover:bg-red-600"
        >
          Not Now
        </Button>
        <Button
          disabled={disableContinue}
          onClick={handleContinue}
          className="px-10 py-6 w-32 font-roobert-regular"
          type="button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
