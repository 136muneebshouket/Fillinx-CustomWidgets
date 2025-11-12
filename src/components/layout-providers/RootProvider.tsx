"use client";
import RecoilRoot from "@/app/recoil-root";
import React from "react";

const RootProvider = ({ children }) => {
  return (
    <>
      <RecoilRoot>{children}</RecoilRoot>
    </>
  );
};

export default RootProvider;
