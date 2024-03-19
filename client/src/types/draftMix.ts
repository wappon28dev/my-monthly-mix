import { type SongData } from "@/types/res";

export type DraftMix = Array<{
  userInput: {
    comment: string;
  };
  songData: SongData;
}>;