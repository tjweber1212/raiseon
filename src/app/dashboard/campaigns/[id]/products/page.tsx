"use client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { addProduct, getProducts } from "./actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductsPage({
  params,
}: Props) {
  const { id } = use(params);

  return (
    <ProductsForm campaignId={id} />
  );
}

function ProductsForm({
  campaignId,
}: {
  campaignId: string;
}) {
    const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([]);

useEffect(() => {
  async function loadProducts() {
    const data = await getProducts(campaignId);
    setProducts(data);
  }

  loadProducts();
}, [campaignId]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

try {
 await addProduct({
 campaignId,
 name,
 price: Number(price),
 });
} catch (error) {
 const message = error instanceof Error ? error.message : "Unable to add product.";
 alert(message);
 console.error(error);
 return;
}
const updatedProducts = await getProducts(campaignId);
setProducts(updatedProducts);
    alert("Product created!");

    setName("");
    setPrice("");
  }

  return (
    <main className="mx-auto max-w-2xl p-10">
        <button
  type="button"
  onClick={() => router.push("/dashboard/campaigns/" + campaignId)}
  className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
>
  ← Back to Campaign Dashboard
</button>
      <h1 className="mb-6 text-4xl font-bold text-black">
        Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full rounded-lg border p-3"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Add Product
        </button>
      </form>
      <h2 className="mt-10 text-2xl font-bold">Current Products</h2>
      <div className="mt-4 space-y-3">
        {products.map((product) => (
            <div key={product.id} className="rounded-lg border bg-white p-4">
  <p className="font-semibold">{product.name}</p>
  <p className="text-sm text-gray-600">
    ${Number(product.price).toFixed(2)}
  </p>
</div>
))}
</div>
    </main>
  );
}