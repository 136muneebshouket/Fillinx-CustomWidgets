"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const CustomBlockPage = dynamic(
  () => import("../page-component").then((mod) => mod.CustomBlockPage),
  { ssr: false }
);

const page = () => {
  let defaultBlock = {
    id: "",
    title: "Custom Block Title",
    css: "* {\n padding: 0;\n margin: 0;\n}\n.container {\n height: 300px;\n background-color: white;\n display: flex;\n justify-content: center;\n align-items: center;\n}",
    html: '<div class="container">\n Hello Tapday! \n</div>',
    js: "",
    height: 300,
    generatedHtml: "",
    head: "",
  };

  const selectedBlock = useMemo(() => defaultBlock, [defaultBlock]);

  //   console.log(defaultBlock);


  return (
    <>
      {selectedBlock ? (
        <CustomBlockPage selectedBlock={selectedBlock} creatingNewBlock={true} />
      ) : null}
    </>
  );
};

export default page;
