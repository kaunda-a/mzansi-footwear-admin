import Nav from "@/components/nav/nav";
import ProductTemplate from "@/components/product-details/product-template";
import Tabs from "@/components/product-details/tabs";
import { getProductServer } from "@/lib/api/products/get-product";
import { makeColorVariant } from "@/lib/utils";
import { notFound } from "next/navigation";

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ pid: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { product } = await getProductServer(resolvedParams.pid).catch((_) =>
    notFound(),
  );

  return (
    <Nav>
      <Tabs pid={resolvedParams.pid} product={product}>
        <ProductTemplate
          product={{
            basePrice: product.basePrice,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            description: product.description,
            earnings: product.earnings,
            keywords: product.keywords,
            offerPrice: product.offerPrice,
            purchases: product.purchases,
            shortDescription: product.shortDescription,
            stock: product.stock,
            slug: product.slug,
            title: product.title,
            variantName: product.variantName,
            variantValues: product.variantValues,
            id: product.id,
            colorVariants: makeColorVariant({
              colors: product.color,
              images: product.Image,
            }),
          }}
          searchParams={resolvedSearchParams}
        />
      </Tabs>
    </Nav>
  );
};

export default ProductPage;
