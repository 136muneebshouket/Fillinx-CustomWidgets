"use client";

import React, { useEffect, useState } from "react";

import { hooks } from "fillinxsolutions-provider";
import { Product } from "fillinxsolutions-provider/modules/graphql/meta-recoil";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ModalHeader } from "./modal-header";
import { SearchProductsInput } from "./product-selection-modal";
import { ProductCard } from "./product-card";
import { ProductsListing } from "./product-listing";

export type SelectedProduct = {
  id: string;
  image: string;
  title: string;
  price?: string;
} | null;

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onProductSelect: (data: SelectedProduct) => void;
  selectedItem?: Product;
  isCustomBlockSelection?: boolean;
}
export const CollectionSelectionModal = ({
  open,
  setOpen,
  onProductSelect,
  selectedItem,
  isCustomBlockSelection,
}: Props) => {
  const [selectedProduct, setselectedProduct] = useState<Product | undefined>(
    selectedItem
  );
  const [search, setsearch] = useState("");
  const {
    data,
    isLoading,
    loadMore,
    isLoadingMore,
    isReachingEnd,
    error,
    isSearchLoader,
  } = hooks.useCollections({
    limit: 50,
    search,
  });
  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore || isLoading,
    hasNextPage: !isReachingEnd,
    onLoadMore: loadMore,
    disabled: !!error,

    rootMargin: "0px 0px 400px 0px",
  });
  useEffect(() => {
    if (open) {
      setselectedProduct(selectedItem);
    }
  }, [open, selectedItem]);
  return (
    <Dialog open={open}>
      <DialogContent
        className={
          "p-0 lg:max-w-screen-xl overflow-hidden h-[80vh] gap-0 flex flex-col justify-start "
        }
      >
        <ModalHeader
          disableContinue={selectedProduct ? false : true}
          handleContinue={() => {
            if (!selectedProduct) {
              return;
            }
            onProductSelect({
              id: selectedProduct.id.toString(),
              image: selectedProduct.image,
              title: selectedProduct.title,
            });
            setOpen(false);
          }}
          title="Select Collection"
          description="Select a collection and display the latest updated products."
          handleClose={() => {
            setOpen(false);
          }}
        />
        <div className="">
          <SearchProductsInput
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            placeholder="Search with Title"
          />
        </div>
        <div className="px-7.5 pb-7.5 overflow-auto pt-4">
          {selectedProduct && data?.length > 0 && (
            <>
              <p className="font-roobert-regular text-secondary-dark pb-4">
                Current Selected Collection:
              </p>
              <div className="grid gap-4 lg:grid-cols-4 grid-cols-1 pb-4">
                <ProductCard item={selectedProduct} onClick={() => {}} />
              </div>
            </>
          )}
          {data?.length > 0 && (
            <p className="font-roobert-regular text-secondary-dark pb-4">
              Total Collections: {data?.length}
            </p>
          )}
          <ProductsListing
            isSearchLoader={isSearchLoader}
            data={data ?? []}
            isLoading={isLoading}
            onProductSelect={(data) => {
              if (isCustomBlockSelection) {
                onProductSelect(data as any);
                return;
              }
              setselectedProduct(data);
            }}
            selectedProduct={selectedProduct}
          />
          {(isLoading || isLoadingMore || !isReachingEnd) && (
            <div ref={sentryRef} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
