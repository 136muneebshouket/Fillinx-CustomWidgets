"use client";

import {
  commentsOfDataTab,
  commentsOfJsTab,
  commentsOfSchemaTab,
  commentsOfTranslationTab,
} from "@/lib/global/GlobalVariables";
import { CustomBlockType } from "@/lib/recoil/custom-blocks-state";
import dynamic from "next/dynamic";
import React from "react";

const WidgetForm = dynamic(
  () => import("@/components/widget/WidgetForm").then((mod) => mod.default),
  { ssr: false }
);

const page = () => {
  const defaultBlock : CustomBlockType = {
    id: "",
    title: "Custom Template Block Title",
    type: "templateBlocks",
    css: "* {\n padding: 0;\n margin: 0;\n}\n.container {\n height: 300px;\n background-color: white;\n display: flex;\n justify-content: center;\n align-items: center;\n}",
    html: '<div class="container">\n Template Block! \n</div>',
    js: `${commentsOfJsTab}`,
    // js: '',
    height: 300,
    generated_html: "",
    description: "Create your custom Template block",
    head: "",
    translations: commentsOfTranslationTab,
    data: commentsOfDataTab,
    schema: commentsOfSchemaTab,
    shopType: "global",
    shops: [],
    status: true,
    configuration: "",
    isTemplateWidget: true,
    pin: false,
    favourite: false,
  };

  // const selectedBlock = useMemo(() => defaultBlock, [defaultBlock]);
  return (
    <>
      {defaultBlock ? (
        <>
          {" "}
          <WidgetForm
            defaults={defaultBlock}
            editMode={false}
            isTemplateWidget={true}
          />
        </>
      ) : null}
    </>
  );
};

export default page;
