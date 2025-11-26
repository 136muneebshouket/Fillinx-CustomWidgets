"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useUnsavedChanges(enabled: boolean) {
  const router = useRouter();

  // Warn on tab close / refresh
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);

  // Intercept BACK/FORWARD buttons
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = () => {
      const leave = window.confirm(
        "You have unsaved changes. Do you really want to leave?"
      );
      if (!leave) {
        history.pushState(null, "", window.location.href); // cancel navigation
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [enabled]);

  // Intercept <Link> clicks
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Allow clicks that aren't navigation
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      // External links should be allowed normally
      if (href.startsWith("http")) return;

      const leave = window.confirm(
        "You have unsaved changes. Do you really want to leave this page?"
      );

      if (!leave) {
        e.preventDefault(); // cancel the link navigation
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [enabled]);
}
