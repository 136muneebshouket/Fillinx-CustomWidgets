"use client";

import React, { useMemo } from "react";
import { useCustomBlockState } from "./(hooks)";
import { useSearchParams } from "next/navigation";
import { CustomBlockPage } from "./page-component";

const BlockRenderer = () => {
  const { state } = useCustomBlockState();

  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected-block") as string;
  const selectedBlock = useMemo(
    () =>
      state?.blocks?.find((block) => String(block.id) === String(selectedId)),
    [selectedId, state?.blocks]
  );

  // console.log(selectedBlock);

  return (
    <>
      <CustomBlockPage selectedBlock={selectedBlock!} />
    </>
  );
};

export default BlockRenderer;
