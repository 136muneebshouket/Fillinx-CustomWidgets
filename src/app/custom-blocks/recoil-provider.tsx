"use client";

import React, { useEffect, useState } from "react";
import { recoil } from "fillinxsolutions-provider";
import { customBlockAtom, CustomBlockAtomType } from "./recoil";
import { discardAtom } from "../utils/postPage";
import RecoilRoot from "../recoil-root";

interface Props {
  data: CustomBlockAtomType;
  children: React.ReactNode;
}

const InnerProvider = ({ children, data }: Props) => {
  const setDiscard = recoil.useSetRecoilState(discardAtom);
  const setCustomBlocks = recoil.useSetRecoilState(customBlockAtom);
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setCustomBlocks(data);
    setDiscard((prev) => ({
      ...prev,
      "custom-blocks": data as any,
    }));
    setisMounted(true);
  }, [data, setCustomBlocks, setDiscard]);
  if (!isMounted) {
    return null;
  }
  return <>{children}</>;
};

export const CustomBlocksRecoilProvider = ({ children, data }: Props) => {
  return (
    <RecoilRoot>
      <InnerProvider data={data}>{children}</InnerProvider>
    </RecoilRoot>
  );
};
