import { useStore } from "@nanostores/react";
import { getDraftMix } from "@/lib/stores/ui";
import { type MonthlyDate } from "@/types/monthly";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useDraftMix(monthlyDate: MonthlyDate) {
  const $draftMix = getDraftMix(monthlyDate);
  const draftMix = useStore($draftMix);

  return { $draftMix, draftMix };
}
