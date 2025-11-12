"use client";
import React from "react";
import { Product } from "fillinxsolutions-provider/modules/graphql/meta-recoil";
import { ProductCard } from "./product-card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProductsListing = ({
  data,
  isLoading,
  onProductSelect,
  selectedProduct,
  isSearchLoader,
}: {
  data: Product[];
  isLoading: boolean;
  onProductSelect: (data: Product) => void;
  selectedProduct?: Product;
  isSearchLoader?: boolean;
}) => {
  if (
    !isLoading &&
    !isSearchLoader &&
    Array.isArray(data) &&
    data.length === 0
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center pt-10">
        {/* <SadSearch className="h-30 w-30" /> */}
        <div className="flex items-center flex-col flex-1 justify-center w-full mt-20">
          <Search className="h-[80px] w-[80px]" />
          <h3>Nothing Found!</h3>
          <p className="text-lg font-roobert-regular text-secondary-dark">
            Try searching with different keywords.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        " grid gap-4 lg:grid-cols-4 grid-cols-1 grid-rows-2 overflow-y-auto"
      )}
    >
      {!isSearchLoader &&
        Array.isArray(data) &&
        data.length > 0 &&
        data.map((item, i) => (
          // <motion.div
          //   onClick={() => {
          //     onProductSelect(item)
          //   }}
          //   key={i}
          //   className={cn(
          //     'border h-28 rounded-md w-full transition-all flex p-1 relative',
          //     'cursor-pointer hover:shadow-md',
          //     {
          //       'border-primary':
          //         selectedProduct?.id?.toString() === item.id.toString()
          //     }
          //   )}
          // >
          //   <div className="relative h-full rounded-sm w-28  overflow-hidden flex justify-center bg-cardinner items-center pt-1">
          //     <ImageWithPlaceholder
          //       src={item.image ? item.image : ''}
          //       placeholderProps={{
          //         height: 30,
          //         width: 30
          //       }}
          //       fill
          //       className="object-cover"
          //     />
          //   </div>
          //   <span className="h-full flex flex-col justify-center px-2 flex-grow max-w-40">
          //     <p className="text-sm font-medium text-secondary-lightdark truncate flex-fill">
          //       {item.title}
          //     </p>
          //     {item.price && (
          //       <p className="text-xs text-secondary-dark font-medium">
          //         {currency}
          //         {item.price}
          //       </p>
          //     )}
          //   </span>
          //   {selectedProduct?.id?.toString() === item.id.toString() && (
          //     <TickCircleIcon className="absolute top-2 right-2 h-6 w-6 text-primary" />
          //   )}
          // </motion.div>
          <>
            <ProductCard
              key={i}
              onClick={() => {
                onProductSelect(item);
              }}
              item={item}
              selectedProduct={selectedProduct}
            />
          </>
        ))}
      {isLoading && Array.from({ length: 50 }).map((_, i) => <>Loading....</>)}
    </div>
  );
};
