import { type SongData } from "@/types/res";

export type DraftMix = {
  userInput: {
    url: string;
    comment: string;
  };
  songData?: SongData;
};
