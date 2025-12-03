import { Loader } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="flex items-center justify-center py-8 bg-background dark:bg-black h-screen w-full">
        <Loader className="h-5 w-5 animate-spin text-muted-foreground dark:text-slate-400" />
      </div>
    </>
  );
}
