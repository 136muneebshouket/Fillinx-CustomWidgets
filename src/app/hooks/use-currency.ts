"use client";

import { Shop } from "fillinxsolutions-provider/modules/routes/user/shop";
import { useShopFullFetch } from "../utils/auth";

export const useCurrency = (): { currency: string } => {
  const { data } = useShopFullFetch();

  const shopactive: Shop = data?.data;
  const currency = shopactive ? shopactive?.currency : "€";
  const activeCurrency =
    currency == "USD"
      ? "$"
      : currency == "EUR"
      ? "€"
      : currency == "GBP"
      ? "£"
      : currency?.toUpperCase() + " ";
  return {
    currency: activeCurrency,
  };
};
