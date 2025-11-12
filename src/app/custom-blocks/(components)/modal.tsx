"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
interface TabSwitchAlertDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  title: string;
  description: string;
  submitLoading?: boolean;
}
export function AlterationContentModal({
  handleClose,
  open,
  handleSubmit,
  description,
  title,
  submitLoading,
}: TabSwitchAlertDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className={
          "lg:max-w-screen h-auto !shadow-backdrop bg-yellow p-10 border-2 border-black bg-black"
        }
      >
        <DialogHeader className="flex flex-col justify-center items-center p-8  bg-yellow space-y-4">
          <Image
            src="/modal/svg/warning.svg"
            height="75"
            width="75"
            alt="img"
            className=" rounded-md  hover:text-black"
          />
          <DialogTitle>
            <p className="font-bold text-center text-white text-2xl">
              <u>{title}</u>
            </p>
          </DialogTitle>
          <DialogDescription>
            <p className=" font-normal text-base text-center">{description}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <Button
            onClick={handleClose}
            className="flex-1 h-14 bg-transparent  text-white border-black "
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-black hover:bg-yellow h-14 border border-black "
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
