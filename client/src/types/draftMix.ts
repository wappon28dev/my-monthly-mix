import { z } from "zod";
import { zSongData } from "@/types/res";

export const zDraftMix = z.array(
  z.object({
    userInput: z.object({
      comment: z.string(),
    }),
    songData: zSongData,
  }),
);
export type DraftMix = z.infer<typeof zDraftMix>;
