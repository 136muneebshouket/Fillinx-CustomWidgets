"use client";

import { useRouter } from "next/navigation";

export function useSafeNavigation(isDirty: boolean) {
  const router = useRouter();

  const safePush = (url: string) => {
    if (isDirty) {
      const leave = window.confirm(
        "You have unsaved changes. Do you really want to leave this page?"
      );

      if (!leave) return; // Cancel navigation
    }

    router.push(url); // Continue navigation
  };

  const safeReplace = (url: string) => {
    if (isDirty) {
      const leave = window.confirm(
        "You have unsaved changes. Do you really want to leave this page?"
      );

      if (!leave) return;
    }

    router.replace(url);
  };

  return { safePush, safeReplace };
}
