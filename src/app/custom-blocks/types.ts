export interface CustomBlockProductType {
  id: string;
  title: string;
  price: string;
  image: string;
  type: "product" | "collection";
}

export enum ProductEnums {
  TITLE = "title",
  PRICE = "price",
  IMAGE = "image",
}

export enum CustomBlockTabsEnums {
  HTML = "html",
  CSS = "css",
  JS = "js",
  HEAD = "head",
  DATA = "data",
  TRANSLATIONS = "translations",
  TAGSTYLES = "tagStyles"
}

// custom block atom
export type CustomBlockType = {
  id: string;
  html: string;
  css: string;
  js: string;
  head: string;
  height: number;
  generatedHtml: string;
  title: string;
  data?: any;
  translations?: any;
  tagStyles? : any;
};
