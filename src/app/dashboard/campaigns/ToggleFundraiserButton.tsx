"use client";

import { toggleFundraiser } from "./actions";

type Props = {
  campaignId: string;
  active: boolean;
};

export default function ToggleFundraiserButton({
  campaignId,
  active,
}: Props) {
  return (
    <button
      onClick={async () => {
        await toggleFundraiser(campaignId, active);
        window.location.reload();
      }}
      className={
        active
          ? "mt-2 inline-block rounded bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
          : "mt-2 inline-block rounded bg-green-50 px-3 py-1 text-sm font-medium text-green-700"
      }
    >
      {active ? "Deactivate" : "Activate"}
    </button>
  );
}