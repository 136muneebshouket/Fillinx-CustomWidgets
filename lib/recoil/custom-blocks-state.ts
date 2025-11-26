import { create } from "zustand";

export interface CustomBlockType {
  id: string;
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
  head: string;
  data: string;
  translations: string;
  schema: string;
  height: number;
  generated_html: string;
  shopType?: "global" | "shop";
  shops?: Array<{ id: string; name: string }>;
  status: boolean;
  created_at?: any;
}

export interface CustomBlockStore {
  blocks: CustomBlockType[];
  setBlocks: (blocks: CustomBlockType[]) => void;
  addBlock: (block: CustomBlockType) => void;
  updateBlock: (id: string, block: Partial<CustomBlockType>) => void;
  deleteBlock: (id: string) => void;
}

export const defaultCustomBlockItem: CustomBlockType = {
  id: "",
  title: "Custom Block Title",
  description: "",
  html: '<div class="container">\n  Hello Tapday!\n</div>',
  css: "* {\n  padding: 0;\n  margin: 0;\n}\n.container {\n  height: 300px;\n  background-color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
  js: "",
  head: "",
  data: "",
  translations: "",
  schema: "",
  height: 300,
  generated_html: "",
  shopType: "global",
  shops: [],
  status: true,
};

export const useCustomBlockStore = create<CustomBlockStore>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  updateBlock: (id, updatedBlock) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updatedBlock } : block
      ),
    })),
  deleteBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
}));
