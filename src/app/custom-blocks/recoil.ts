import { recoil } from "fillinxsolutions-provider";
import { CustomBlockType, CustomBlockTabsEnums } from "./types";
export interface CustomBlockAtomType {
  blocks: CustomBlockType[];
}
export const customBlockAtom = recoil.atom<CustomBlockAtomType>({
  key: "custom-blocks",
  default: {
    blocks: [
      {
        id: "1",
        title: "Custom Block Title",
        css: "",
        html: "",
        js: "",
        height: 0,
        generatedHtml: "",
        head: "",
      },
    ],
  },
});

export const defaultCustomBlockItem: CustomBlockType = {
  id: "1",
  title: "Custom Block Title",
  css: `
  * {
  padding: 0;
  margin: 0;
  }
  .container {
  height: 300px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
  html: `<div class="container">
  Hello Tapday!
</div> `,
  js: "",
  height: 300,
  generatedHtml: "",
  head: "",
  data:"",
  translations:""
};
