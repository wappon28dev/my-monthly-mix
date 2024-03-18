import { persistentAtom } from "@nanostores/persistent";
import { getLocalStorageKey, monthlyDate2str } from "../utils";
import { type DraftMix } from "@/types/draftMix";
import { type MonthlyDate } from "@/types/monthly";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getDraftMix = (monthlyDate: MonthlyDate) =>
  persistentAtom<DraftMix[]>(
    getLocalStorageKey(`songDataList-${monthlyDate2str(monthlyDate)}`),
    [],
    {
      encode: JSON.stringify,
      decode: JSON.parse,
    },
  );
