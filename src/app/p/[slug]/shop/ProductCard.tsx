"use client";

import { useState } from "react";

export default function ProductCard({
  name,
  price,
}: {
  name: string;
  price: number;
}) {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="rounded-lg border p-5">
      <h2 className="text-xl font-semibold">{name}</h2>

      <p className="mt-2 text-lg">
        ${Number(price).toFixed(2)}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(0, quantity - 1))}
          className="h-10 w-10 rounded bg-gray-200 text-xl"
        >
          -
        </button>

        <span className="w-8 text-center text-lg font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className="h-10 w-10 rounded bg-blue-600 text-xl text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}