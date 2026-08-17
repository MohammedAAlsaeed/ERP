import type { Metadata } from "next";

import { ProductsView } from "@/components/views/products-view";

export const metadata: Metadata = { title: "المنتجات | ERP" };

export default function Page() {
  return <ProductsView />;
}
