"use client";

import { useState } from "react";
import { createOrder } from "./actions";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ShopCart({
  products,
  contactId,
  playerId,
  campaignId,
  inviteToken,
}: {
  products: Product[];
  contactId: string | null;
  playerId: string;
  campaignId: string;
  inviteToken: string | null;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

function changeQuantity(id: string, change: number) {
  setQuantities((current) => {
    const updated = { ...current };

    updated[id] = Math.max(
      0,
      (current[id] || 0) + change
    );

    return updated;
  });
}


  const total = products.reduce((sum, product) => {
    return sum + product.price * (quantities[product.id] || 0);
  }, 0);
async function handleCheckout() {
  if (!contactId) {
    alert("Please use your supporter invitation link to checkout.");
    return;
  }

  if (total <= 0) {
    alert("Please select at least one product.");
    return;
  }
const items = products
  .filter((product) => (quantities[product.id] || 0) > 0)
  .map((product) => ({
    productId: product.id,
    quantity: quantities[product.id],
  }));
setIsCheckingOut(true);

try {
const result = await createOrder({
 inviteToken,
 items,
});

if (result.checkoutUrl) {
window.location.href = result.checkoutUrl;
return;
}
} catch (error) {
  alert("Unable to create order. Please try again.");
} finally {
  setIsCheckingOut(false);
}
}
  if (orderComplete) {
  return (
    <div className="rounded-xl border bg-green-50 p-8 text-center">
      <div className="text-4xl">✓</div>

      <h2 className="mt-4 text-2xl font-bold">
        Thank You!
      </h2>

      <p className="mt-2 text-gray-700">
        Your order was created successfully.
      </p>

      <p className="mt-1 text-gray-600">
        Thanks for supporting this fundraiser!
      </p>
    </div>
  );
}
return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const quantity = quantities[product.id] || 0;

          return (
            <div
              key={product.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {product.name}
              </h2>

<p className="mt-2 text-xl font-bold text-blue-600">
  ${product.price.toFixed(2)}
</p>

              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => changeQuantity(product.id, -1)}
                  className="h-10 w-10 rounded bg-gray-200 text-xl"
                >
                  -
                </button>

                <span className="w-8 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => changeQuantity(product.id, 1)}
                  className="h-10 w-10 rounded bg-blue-600 text-xl text-white"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

<div className="mt-8 rounded-xl border bg-gray-50 p-6">
  <div className="flex items-center justify-between">
    <span className="text-lg font-semibold">
      Order Total
    </span>

    <span className="text-2xl font-bold">
      ${total.toFixed(2)}
    </span>
  </div>

  <button
    type="button"
    onClick={handleCheckout}
    disabled={total <= 0 || isCheckingOut}
    className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
  >
    {isCheckingOut ? "Processing..." : "Checkout"}
  </button>

  <p className="mt-3 text-center text-sm text-gray-500">
    Your purchase supports this fundraiser.
  </p>
</div>
    </div>
  );
}