"use client";

import { useMemo } from "react";
import { BillingIndicator } from "@/components/billing-indicator";
import { ProductsTable } from "@/components/products-table";
import { TotalHourPrintIndicator } from "@/components/total-hour-print-indicator";
import { TotalProductsCount } from "@/components/total-products-count";
import { useProducts } from "@/hooks/use-products";
import { isSameMonth } from "@/utils/date-filters";

export function HomeOverview() {
  const {
    createProduct,
    deleteProduct,
    error,
    fetchProducts,
    isLoading,
    products,
    updateProduct,
  } = useProducts();

  const { billingThisMonth, hoursThisMonth, productsMonthly } = useMemo(() => {
    const now = new Date();

    const productsThisMonth = products.filter((product) =>
      isSameMonth(product.createdAt, now)
    );

    return {
      billingThisMonth: productsThisMonth.reduce(
        (total, product) => total + product.salePrice,
        0
      ),
      hoursThisMonth: productsThisMonth.reduce(
        (total, product) => total + product.totalHours,
        0
      ),
      productsMonthly: productsThisMonth.length,
    };
  }, [products]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BillingIndicator value={billingThisMonth} />
        <TotalHourPrintIndicator hours={hoursThisMonth} />
        <TotalProductsCount count={productsMonthly} />
      </div>

      <ProductsTable
        createProduct={createProduct}
        deleteProduct={deleteProduct}
        error={error}
        isLoading={isLoading}
        onRefresh={fetchProducts}
        products={products}
        updateProduct={updateProduct}
      />
    </div>
  );
}
