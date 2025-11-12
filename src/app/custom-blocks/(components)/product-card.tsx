import React from "react";
import { motion } from "framer-motion";
import { Product } from "fillinxsolutions-provider/modules/graphql/meta-recoil";
import { useCurrency } from "@/app/hooks/use-currency";
import { ImageWithPlaceholder } from "./image-with-placeholder";
import { cn } from "@/lib/utils";

interface Props {
  onClick: () => void;
  selectedProduct?: Product;
  item?: Product;
}
export const ProductCard = ({ onClick, selectedProduct, item }: Props) => {
  const { currency } = useCurrency();
  if (!item) {
    return;
  }
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "border h-28 rounded-md w-full transition-all flex p-1 relative",
        "cursor-pointer hover:shadow-md",
        {
          "border-primary":
            selectedProduct?.id?.toString() === item.id.toString(),
        }
      )}
    >
      <div className="relative h-full rounded-sm w-28  overflow-hidden flex justify-center bg-cardinner items-center">
        <ImageWithPlaceholder
          src={item.image ? item.image : ""}
          placeholderProps={{
            height: 30,
            width: 30,
          }}
          className="object-cover h-full w-full"
          unoptimized={true}
        />
      </div>
      <span className="h-full flex flex-col justify-center px-2 flex-grow max-w-40">
        <p className="text-sm font-medium text-secondary-lightdark truncate flex-fill">
          {item.title}
        </p>
        {item.price && (
          <p className="text-xs text-secondary-dark font-medium">
            {currency}
            {item.price}
          </p>
        )}
      </span>
    </motion.div>
  );
};
