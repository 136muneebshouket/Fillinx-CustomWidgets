"use client";

import React, { useEffect, useState } from "react";

import { hooks } from "fillinxsolutions-provider";
import { Product } from "fillinxsolutions-provider/modules/graphql/meta-recoil";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductCard } from "./product-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModalHeader } from "./modal-header";
import useInfiniteScroll from "react-infinite-scroll-hook";
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

export function SearchProductsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
}) {
  return (
    <>
      <div className="my-4 w-full relative mx-auto px-4">
        <Input
          className="px-[3rem] bg-white-dark rounded-sm text-sm h-12 mx-auto border-none"
          id="title"
          value={value}
          onChange={onChange}
          name="title"
          placeholder={placeholder ?? "Search"}
        />
        <Search className="w-5 h-5 text-secondary-light absolute top-[14px] left-9" />
      </div>
      <Separator />
    </>
  );
}

export const ProductSelectionModal = ({
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
  // const { data, isLoading } = hooks.useFilterProducts({
  //   meta: {
  //     search,
  //     barcode: '',
  //     collectionID: '',
  //     numberOfProducts: 10,
  //     sku: '',
  //     status: '',
  //     vendor: ''
  //   }
  // })
  const {
    data,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    isSearchLoader,
    loadMore,
  } = hooks.useProductsMeta({
    search,
    limit: 9,
  });

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading || !!isLoadingMore || isSearchLoader,
    hasNextPage: !isReachingEnd,
    onLoadMore: loadMore,
    rootMargin: "0px 0px 400px 0px",
  });
  useEffect(() => {
    if (open) {
      setselectedProduct(selectedItem);
    }
  }, [open, selectedItem]);
  return (
    <>
      <Dialog open={open}>
        <DialogContent
          className={
            "p-0 lg:max-w-screen-xl h-[80vh] overflow-hidden gap-0 flex flex-col justify-start "
          }
        >
          <ModalHeader
            title="Select Product"
            description="Find and select our product with our quick filter"
            handleClose={() => {
              setOpen(false);
            }}
            disableContinue={!selectedProduct}
            handleContinue={() => {
              if (!selectedProduct) {
                return;
              }
              onProductSelect({
                id: selectedProduct.id.toString(),
                image: selectedProduct.image,
                title: selectedProduct.title,
                price: selectedProduct?.price?.toString(),
              });
              setOpen(false);
            }}
          />
          <div className="">
            {/* <Input
              className="m-0 bg-background border border-input"
              id="search-products"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              name="search-products"
              placeholder="Search with Title"
            /> */}
            <SearchProductsInput
              onChange={(e) => setsearch(e.target.value)}
              placeholder="Search with Title"
              value={search}
            />
          </div>
          <div className="px-7.5 pb-7.5 overflow-auto max-h-[500px] pt-4">
            {selectedProduct && data?.length > 0 && (
              <>
                <p className="font-roobert-regular text-secondary-dark pb-4">
                  Current Selected Product
                </p>
                <div className="grid gap-4 lg:grid-cols-4 grid-cols-1 pb-4">
                  <ProductCard item={selectedProduct} onClick={() => {}} />
                </div>
              </>
            )}
            {/* {data?.length > 0 && (
              <p className="font-roobert-regular text-secondary-dark pb-4">
                Total Products: {productsCount}
              </p>
            )} */}

            <ProductsListing
              data={data ?? []}
              isLoading={isLoading}
              onProductSelect={(product) => {
                if (isCustomBlockSelection) {
                  onProductSelect(product as any);
                  return;
                }
                setselectedProduct(product);
              }}
              selectedProduct={selectedProduct}
            />
            {(isLoading ||
              !!isLoadingMore ||
              isSearchLoader ||
              !isReachingEnd) && <div ref={sentryRef} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
