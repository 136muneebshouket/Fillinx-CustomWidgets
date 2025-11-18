import { recoil } from "fillinxsolutions-provider";
import {
  customBlockAtom,
  CustomBlockAtomType,
  defaultCustomBlockItem,
} from "./recoil";
import { useCallback } from "react";
import { CustomBlockType } from "./types";
// import { pdpStateAtom } from '@/src/state/product-details/(recoil)'
import { usePathname } from "next/navigation";
import { devCart } from "./data";
import { usePostPage } from "../utils/postPage";
import { v4 as uuid } from "uuid";
import { revalidate } from "../utils/server";
import { delete_api_template } from "@/lib/API/ApiTemplates";
import { TapdayApiPaths } from "@/lib/APIPaths/GlobalApiPaths";

export const useCustomBlockState = () => {
  const { generatePreview } = useGenerateCustomBlockPreview();
  const [state, setState] = recoil.useRecoilState(customBlockAtom);
  const { postPage } = usePostPage("custom-blocks");

  const handleSaveBlocks = async ({
    height,
    selectedBlckId,
    generatedHtml,
  }: {
    height: number;
    selectedBlckId: string;
    generatedHtml: string;
  }) => {
    const existingBlock = state.blocks.find(
      (block) => block.id === selectedBlckId
    );

    let newState: CustomBlockAtomType;
    let blockToSave: CustomBlockType;

    if (existingBlock) {
      // Update existing block
      blockToSave = {
        ...existingBlock,
        height,
        generatedHtml,
      };
      newState = {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id === selectedBlckId) {
            return blockToSave;
          }
          return block;
        }),
      };
    } else {
      // Create new block with the selectedBlckId
      blockToSave = {
        ...defaultCustomBlockItem,
        id: selectedBlckId,
        height,
        generatedHtml,
      };
      newState = {
        ...state,
        blocks: [...state.blocks, blockToSave],
      };
    }

    // console.log(blockToSave);
    // return;

    setState(newState);
    localStorage.setItem("custom-blocks", JSON.stringify(newState));

    // Send update to API
    try {
      const { baseUrl } = await import("../utils/use-fetch");
      const response = await fetch(
        `${baseUrl}/custom-widgets/${selectedBlckId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 229033|iCV3Cf3RYXKS3cV9bBe3R3V2WSz1qTVGH5LscWmI2706d738",
          },
          body: JSON.stringify({
            type: "templateBlocks",
            title: blockToSave.title,
            html_content: blockToSave.html,
            generated_html: blockToSave.generatedHtml,
            css_content: blockToSave.css,
            js_content: blockToSave.js,
            head: blockToSave.head,
            height: blockToSave.height.toString(),
            data: blockToSave.data || "",
            translations: blockToSave.translations || "",
            tagStyles: blockToSave.tagStyles || "",
            shopType: blockToSave.shopType || "global", // global , byIds
            shops: blockToSave.shops,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Custom widget updated successfully:", result);
    } catch (error) {
      console.error("Failed to update custom widget:", error);
      throw error;
    }
  };

  const handleCreateNewBlock = async () => {
    const newId = uuid();
    const newState = {
      ...state,
      blocks: [
        {
          ...defaultCustomBlockItem,
          id: newId,
          generatedHtml: generatePreview({
            css: defaultCustomBlockItem.css,
            head: defaultCustomBlockItem.head,
            html: defaultCustomBlockItem.html,
            js: defaultCustomBlockItem.js,
          }),
        } as CustomBlockType,
        ...state.blocks,
      ],
    };
    // Update local state instead of API call
    setState(newState);
    // Optionally save to localStorage
    localStorage.setItem("custom-blocks", JSON.stringify(newState));
    return newId;
  };

  return {
    state,
    setState,
    handleSaveBlocks,
    handleCreateNewBlock,
  };
};

export const useDeleteCustomBlock = () => {
  const [state, setState] = recoil.useRecoilState(customBlockAtom);
  const handleDeleteBlock = useCallback(
    async (id: string) => {
      // Call DELETE API
      try {
        // const { baseUrl } = await import("../utils/use-fetch");

        // const response = await fetch(`${baseUrl}/custom-widgets/${id}`, {
        //   method: "DELETE",
        //   headers: {
        //     Authorization:
        //       "Bearer 229033|iCV3Cf3RYXKS3cV9bBe3R3V2WSz1qTVGH5LscWmI2706d738",
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        const response = await delete_api_template({
          url: TapdayApiPaths?.customWidgets.deleteById(id),
        });

        // Update local state after successful deletion
        const newState = {
          ...state,
          blocks: state.blocks.filter((block) => block.id !== id),
        };
        setState(newState);
        localStorage.setItem("custom-blocks", JSON.stringify(newState));
      } catch (error) {
        console.error("Failed to delete custom widget:", error);
        throw error;
      }
    },
    [state, setState]
  );
  return { handleDeleteBlock };
};

const devProduct = {
  title: "Your Title Here",
  id: "test-id",
  availableForSale: true,
  createdAt: "2024-11-08T12:05:52Z",
  productVariants: [
    {
      price: {
        amount: 949.95,
        currencyCode: "USD",
      },
      title: "Default Title",
      weight: 0,
      weightUnit: "KILOGRAMS",
      availableForSale: true,
      requiresShipping: true,
      id: "test-id",
      quantityAvailable: 0,
      sku: "test-sku",
      unitPrice: null,
      unitPriceMeasurement: null,
      selectedOptions: [
        {
          name: "Title",
          value: "Default Title",
        },
      ],
      compareAtPrice: null,
      image: {
        originalSrc:
          "https://fastly.picsum.photos/id/558/200/300.jpg?hmac=RQvEcTitB2RoOqzwdtXcjckM1FybfSHIq676zecLvkw",
        altText: "Test Alt Text",
      },
      product: null,
    },
  ],
  productType: "Product Type",
  publishedAt: "2025-01-02T13:01:41Z",
  tags: ["Accessory", "Sport", "Winter"],
  updatedAt: "2025-01-02T13:01:41Z",
  images: [
    {
      originalSrc:
        "https://fastly.picsum.photos/id/558/200/300.jpg?hmac=RQvEcTitB2RoOqzwdtXcjckM1FybfSHIq676zecLvkw",
      id: "test-id",
      altText: "test-alt-text",
    },
  ],
  options: [
    {
      id: "test-id",
      name: "Title",
      values: ["Default Title"],
    },
  ],
  vendor: "Vendor Name",
  collectionList: [
    {
      id: "test-collection-id",
      title: "Home page",
      description: "",
      updatedAt: "2025-01-02T13:01:41Z",
      descriptionHtml: "",
      handle: "frontpage",
    },
  ],
  cursor: null,
  onlineStoreUrl: "",
  description: "",
  descriptionHtml: "",
  handle: "the-inventory-not-tracked-snowboard",
  price: 949.95,
  formattedPrice: "Rs949.95",
  hasComparablePrice: false,
  compareAtPrice: 0,
  compareAtPriceFormatted: "",
  image:
    "https://fastly.picsum.photos/id/558/200/300.jpg?hmac=RQvEcTitB2RoOqzwdtXcjckM1FybfSHIq676zecLvkw",
  currencyCode: "PKR",
  isAvailableForSale: false,
};

const devCustomer = {
  id: "test-id",
  firstName: "test-firstName",
  email: "test-email@gmail.com",
  metafields: {
    nodes: [
      {
        id: "test-id",
        key: "test-key",
        namespace: "custom",
        type: "json",
        value: {
          points_balance: 112,
          credits_balance: "0.0",
          status: "member",
          referral_code: "test-referral-code",
        },
        jsonValue: {
          points_balance: 112,
          credits_balance: "0.0",
          status: "member",
          referral_code: "test-referral-code",
        },
        description: "test-description",
      },
    ],
  },
};

const dynamicHeightCalculation = `
    function onBodyScrollHeightChange(callback) {
      let lastHeight = document.body.scrollHeight;

      // Function to check for height changes
      const checkHeightChange = () => {
        const currentHeight = document.body.scrollHeight;
        if (currentHeight !== lastHeight) {
          lastHeight = currentHeight; // Update the last height
          callback(currentHeight);  // Call the callback with the new height
        }
      };

      // Set up a resize event listener to check for changes
      window.addEventListener('resize', checkHeightChange);

      // Optionally, use setInterval to continuously check the height in case content changes dynamically
      const intervalId = setInterval(checkHeightChange, 200);  // Check every 200ms

      // Return a function to stop the listener if needed
      return () => {
        clearInterval(intervalId);  // Stop the interval
        window.removeEventListener('resize', checkHeightChange);  // Remove the event listener
      };
    }

    // Usage example
    const stopListening = onBodyScrollHeightChange((newHeight) => {
      console.log('Body scroll height changed:', newHeight);
      Tapday.callChannel("resize",{height:newHeight})
      window.parent.postMessage({ action: 'resize', height: newHeight }, '*');
    });
`;

const tapdayClass = `
  class TadpaySdk {
      events = {}
      data = {} 
      user = {}
      // this is used to replace the string on the flutter-end side
      replaceProduct=""
      product = ${JSON.stringify(devProduct)}
      customer = ${JSON.stringify(devCustomer)}
      cart = ${JSON.stringify(devCart)}
      replaceProduct=""
      collection = {}
      constructor(data) {
        this.data = data
      }
      // call the post channel
      callChannel (event= "", data = {}) {
        console.log(JSON.stringify({event, data}))
        if(window.FlutterChannel) {
          window.FlutterChannel.postMessage(JSON.stringify({event, data}));
        }
      }
      // app-actions
      actions = {
        openScreen: (data={})=>{
          this.callChannel("openScreen", data)
        },
        // [{
        //   variantId: "gid://shopify/ProductVariant/44219568193736",
        //   quantity: 1
        // }]
        addToCart: (data={})=>{
          this.callChannel("addToCart", data)
        },
        toast: (data={})=>{
          this.callChannel("toast", data)
        },
        vibrate: ()=>{
          this.callChannel("vibrate",null)
        },
        watch: (eventName, callback)=> {
          if (!this.events[eventName]) {
              this.events[eventName] = [];
          }
          this.events[eventName].push(callback);
        },
        triggerWatch: (eventName, data)=> {
          if (this.events[eventName]) {
              this.events[eventName].forEach(callback => callback(data));
          }
         }
      };
      // app-actions

      eventsType = {
        "recentlyViewed" : "recentlyViewed",
        "home" : "home",
        "collection" : "collection",
        "single-collection" : "single-collection",
        "cart" : "cart",
        "favourite" : "favourite",
        "myAccount" : "myAccount",
        "webUrl" : "webUrl",
        "search" : "search",
        "notifications" : "notifications"
      }
      // variables 

      get variables() {
        return {
          "user": this.user,
          "product": this.product,
          "collection": this.collection,
          "products": this.data.products,
          "collections": this.data.collections,
          "customer": this.customer,
          "cart": this.cart
        }
      }

      updateVariables(event,data) {
        if(!event){
          return
        }
        if(event === "userData") {
          this.user = data
        } else if(event === "productData"){
          this.product = data
        } else if(event === "collectionData"){
          this.collection = data
        }
      }

      // Method to register a listener for a specific event

      listener(eventName, callback) {
          if (!this.events[eventName]) {
              this.events[eventName] = [];
          }
          this.events[eventName].push(callback);
      }

      // Method to trigger an event and pass data to listeners
      trigger(eventName, data) {
          if (this.events[eventName]) {
              this.events[eventName].forEach(callback => callback(data));
          }
      }
    }
`;

const handleBarsLogic = `
    // 'tapday-loop' condition 
    Handlebars.registerHelper('tapday-loop', function (selectedDataType, keys, options) {
      let result = '';
      if(typeof keys === 'object'){
        options = keys
      }
  if (!selectedDataType) return result;
  console.log("for-loop--->",{selectedDataType, keys})
  // If keys are provided
  if (typeof keys !== 'object') {
    const keyList = keys?.split(',').map(key => key.trim()); // Split and trim keys
    keyList.forEach((key) => {
      if (selectedDataType[key]) {
        result += options.fn(selectedDataType[key]); // Render the block with matching data
      }
    });
  } else {
    // If no keys are provided
    if (Array.isArray(selectedDataType)) {
      selectedDataType.forEach((item) => {
        result += options.fn(item); // Render the block for each item in the array
      });
    }
  }

  return new Handlebars.SafeString(result); // Return safe HTML
    });

    // 'tapday-loop' condition 

    // 'tapday-with' condition
    Handlebars.registerHelper('tapday-with', function (selectedDataType, id, options) {
      if(selectedDataType[id]){
        return options.fn(selectedDataType[id])
      }
    })
    // 'tapday-with' condition

    // 'tapday-if' condition
    
      Handlebars.registerHelper('tapday-if', function (context, key, operator, value, options) {
      const actualValue = context[key];
      let result = false;

      switch (operator) {
        case '==':
          result = actualValue == value;
          break;
        case '===':
          result = actualValue === value;
          break;
        case '!=':
          result = actualValue != value;
          break;
        case '!==':
          result = actualValue !== value;
          break;
        case '<':
          result = actualValue < value;
          break;
        case '<=':
          result = actualValue <= value;
          break;
        case '>':
          result = actualValue > value;
          break;
        case '>=':
          result = actualValue >= value;
          break;
        case '&&':
          result = actualValue && value;
          break;
        case '||':
          result = actualValue || value;
          break;
        default:
          throw new Error("Unknown operator");
      }

      if (result) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
    
    // 'tapday-if' condition
`;
export const useGenerateCustomBlockPreview = () => {
  const generatePreview = useCallback(
    ({
      css,
      head,
      html,
      js,
      translations,
      data,
      tagStyles,
    }: {
      head: string;
      css: string;
      html: string;
      js: string;
      translations?: any;
      data?: any;
      tagStyles?: any;
    }) => {
      const fullHTML = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      ${head ?? ""}
    </head>
    <style>
    * {
      padding: 0;
      margin: 0;
      -webkit-tap-highlight-color: transparent;
      /* Removes blue highlight in Android/iOS */
      -webkit-user-select: none;
      /* Prevents text selection in modern browsers */
      -moz-user-select: none;
      /* Prevents text selection in Firefox */ 
      -ms-user-select: none;
      /* Prevents text selection in old IE/Edge */ 
      user-select: none;
      /* Prevents text selection */
      outline: none;
    }
    body {
      background-color: white;
      overflow: hidden;
    }
    ${css}
    
    </style>

    <body id="mainbody">
       ${html}
    </body>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.8/handlebars.min.js" integrity="sha512-E1dSFxg+wsfJ4HKjutk/WaCzK7S2wv1POn1RRPGh8ZK+ag9l244Vqxji3r6wgz9YBf6+vhQEYJZpSjqWFPg9gg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
    ${tapdayClass}

   const Tapday = new TadpaySdk({})

    ${handleBarsLogic}
    const translationsData = ${translations}
    const contentData =  ${data}
    const tagStylesData = ${tagStyles}

    
    for (let elementId in tagStylesData) {
    const element = document.getElementById(elementId)
    if (!element) continue

    // Loop through all styles for this element
    const styles = tagStylesData[elementId]
    for (let i = 0; i < styles.length; i++) {
      element.style[styles[i].type] = styles[i].value
    }
  }


    var mainBodyHtml = document.getElementById("mainbody").innerHTML
    var template = Handlebars.compile(mainBodyHtml);
    const output= template(Tapday.data)
    document.getElementById("mainbody").innerHTML = output

    ${js}
    
    ${dynamicHeightCalculation}
    </script>
    </html>
    `;
      return fullHTML;
    },
    []
  );
  return { generatePreview };
};
