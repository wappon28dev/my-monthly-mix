/* eslint-disable no-console */
import { persistentAtom } from "@nanostores/persistent";
import { getLocalStorageKey, monthlyDate2str } from "../utils";
import { zDraftMix, type DraftMix } from "@/types/draftMix";
import { type MonthlyDate } from "@/types/monthly";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getDraftMix = (monthlyDate: MonthlyDate) =>
  persistentAtom<DraftMix>(
    getLocalStorageKey(`draftMixes-${monthlyDate2str(monthlyDate)}`),
    [],
    {
      encode: (obj) => {
        const result = zDraftMix.safeParse(obj);

        if (!result.success) {
          console.error("Invalid draftMixes data during encoding.");
          throw new Error(result.error.message);
        }

        return JSON.stringify(result.data);
      },
      decode: (str) => {
        try {
          const result = zDraftMix.safeParse(JSON.parse(str));
          if (!result.success) {
            console.error(
              "Invalid draftMixes data during decoding; returning empty array.",
            );
            console.error(result.error);
            return [];
          }
          return result.data;
        } catch (e) {
          console.error(
            "Invalid draftMixes data during decoding; returning empty array.",
          );
          console.error(e);
          return [];
        }
      },
    },
  );
