"use client";
import React, { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useId } from "react";
import { useRedirect } from "@/hooks/use-redirect";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
  link: string;
}
type Tabsprops = {
  tabValues: Tab[];
  active: string;
  outerClassName?: string;
  activeTabClassName?: string;
  textClassName?: string;
  motionClassName?: string;
  isRoute: boolean;
  onClick: (value: string) => void;
};

const CustomTabs = React.forwardRef<HTMLDivElement, Tabsprops>(
  ({
    isRoute,
    outerClassName,
    motionClassName,
    textClassName,
    activeTabClassName,
    tabValues,
    active,
    onClick,
  }) => {
    const id = useId();
    const { updateUrl } = useRedirect();
    return (
      <Tabs>
        <TabsList
          className={cn(
            " w-fit rounded-md bg-white-dark h-fit  p-1 m-0 relative my-4",
            outerClassName
          )}
        >
          {tabValues.map((tab, _index: number) => (
            <React.Fragment key={tab.value}>
              <LinkWrapper link={updateUrl(tab.link)} isRoute={isRoute}>
                <TabsTrigger
                  value={tab.value}
                  id={id}
                  className={cn(
                    `relative p-0 flex  justify-center items-center h-10 w-[120px] m-0 ${active == tab.value ? 'bg-[#171717]' : ""}`,
                    // activeTabClassName
                  )}
                  onClick={() => onClick(tab.value)}
                >
                  {" "}
                  {/* <AnimatePresence> */}
                    {/* {active === tab.value ? (
                      <motion.div
                        className={cn(
                          "underline w-full absolute inset-0 text-xs font-medium rounded-sm ",
                          motionClassName
                        )}
                        layoutId={id}
                      />
                    ) : null} */}
                  {/* </AnimatePresence> */}
                  <span
                    className={cn(
                      "z-10 flex justify-center mx-auto text-xs ",
                      {
                        "text-primary font-semibold": active === tab.value,
                        "text-secondary-dark font-medium": active !== tab.value,
                      },
                      active === tab.value && textClassName
                    )}
                  >
                    {tab.label}
                  </span>
                </TabsTrigger>
              </LinkWrapper>
            </React.Fragment>
          ))}
        </TabsList>
      </Tabs>
    );
  }
);

CustomTabs.displayName = "CustomTabs";

export default CustomTabs;

const LinkWrapper = ({
  isRoute,
  children,
  link,
}: {
  isRoute: boolean;
  children: JSX.Element;
  link: string;
}) => {
  return isRoute ? (
    <Link href={link} className="w-full">
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
};
