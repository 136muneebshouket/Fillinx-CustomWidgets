"use client";
import { FillinxProvider } from "fillinxsolutions-provider";
import React from "react";
import { isProduction } from "./utils/use-fetch";

const RecoilRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* isDev means development and isProduction is production mode so thats why i give !isProduction in order to switch the condition to isDev*/}
      <FillinxProvider isDev={!isProduction}>{children}</FillinxProvider>
    </div>
  );
};

export default RecoilRoot;
