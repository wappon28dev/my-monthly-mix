/* eslint-disable no-console */
import { persistentAtom } from "@nanostores/persistent";
import { type NotificationData, notifications } from "@mantine/notifications";
import { getLocalStorageKey, monthlyDate2str } from "../utils";
import { zDraftMix, type DraftMix } from "@/types/draftMix";
import { type MonthlyDate } from "@/types/monthly";

const encodeErrNotification: NotificationData = {
  id: "encode-err",
  title: "下書きの保存に失敗しました",
  message: "時間をおいて再度お試しください",
  color: "red",
  autoClose: 5000,
};

const decodeErrNotification: NotificationData = {
  id: "decode-err",
  title: "下書きの復元に失敗しました",
  message: "",
  color: "red",
  autoClose: 5000,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getDraftMix = (monthlyDate: MonthlyDate) =>
  persistentAtom<DraftMix>(
    getLocalStorageKey(`draftMixes-${monthlyDate2str(monthlyDate)}`),
    [],
    {
      encode: (obj) => {
        const result = zDraftMix.safeParse(obj);

        if (!result.success) {
          notifications.show(encodeErrNotification);
          console.error("Invalid draftMixes data during encoding.");
          throw new Error(result.error.message);
        }

        return JSON.stringify(result.data);
      },
      decode: (str) => {
        try {
          const result = zDraftMix.parse(JSON.parse(str));
          return result;
        } catch (e) {
          notifications.show(decodeErrNotification);
          console.error(
            "Invalid draftMixes data during decoding; returning empty array.",
          );

          if (e instanceof Error) {
            console.error(e.message);
          }
          return [];
        }
      },
    },
  );
