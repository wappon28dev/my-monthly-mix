/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import { type Session } from "@supabase/supabase-js";
import { v4 as uuidV4 } from "uuid";
import supabase from "@/lib/service/supabase";
import { type Tables } from "@/types/supabase";
import { type OmitStrict } from "@/types/utils";
import { type MonthlyDate } from "@/types/monthly";
import {
  getMonthlyDate,
  monthlyDate2DateRange,
  monthlyDate2str,
} from "@/lib/utils";

export type Mix = OmitStrict<Tables<"mixes">, "song_urls" | "song_comments"> & {
  songs: Array<{
    url: string;
    comment: string;
  }>;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useMix() {
  function convert2mix(data: Tables<"mixes">): Mix {
    const { song_urls, song_comments, ...rest } = data;
    return {
      ...rest,
      songs: data.song_urls.map((url, idx) => ({
        url,
        comment: data.song_comments[idx],
      })),
    };
  }

  function convert2dbSchema(mix: Mix): Tables<"mixes"> {
    const { songs, ...data } = mix;
    return {
      ...data,
      song_urls: mix.songs.map((song) => song.url),
      song_comments: mix.songs.map((song) => song.comment),
    };
  }

  async function fetchAll(session: Session): Promise<Mix[]> {
    const { data, error } = await supabase
      .from("mixes")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (data == null) {
      throw new Error("Failed to fetch mix", {
        cause: error,
      });
    }

    return data.map(convert2mix);
  }

  async function fetchSingle(session: Session, uuid: string): Promise<Mix> {
    const { data, error } = await supabase
      .from("mixes")
      .select("*")
      .eq("id", uuid)
      .eq("user_id", session.user.id)
      .single();

    if (data == null) {
      throw new Error("Failed to fetch mix", {
        cause: error,
      });
    }

    return convert2mix(data);
  }

  async function add(
    session: Session,
    mix: Pick<Mix, "songs" | "description">,
  ): Promise<Mix> {
    const date = new Date();

    const uuid = uuidV4();
    const data = {
      id: uuid,
      user_id: session.user.id,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
      ...mix,
    };

    if (!(await canShareMix(session, getMonthlyDate(date)))) {
      throw new Error("You already shared a mix this month.");
    }

    const result = await supabase.from("mixes").insert(convert2dbSchema(data));
    console.log(result);

    return data;
  }

  async function update(session: Session, mix: Mix): Promise<void> {
    const data = convert2dbSchema(mix);

    console.log(data);

    const result = await supabase
      .from("mixes")
      .update(data)
      .eq("id", mix.id)
      .eq("user_id", session.user.id);

    console.log(result);
  }

  async function fetchSingleByUserId(
    user_id: string,
    monthlyDate: MonthlyDate,
  ): Promise<Mix> {
    const { year, month } = monthlyDate;
    const dateStart = new Date(year, month, 0);
    dateStart.setDate(1);
    const dateEnd = new Date(year, month, 0);

    const { data, error } = await supabase
      .from("mixes")
      .select("*")
      .eq("user_id", user_id)
      .gt("created_at", dateStart.toISOString())
      .lt("created_at", dateEnd.toISOString())
      .single();

    if (data == null) {
      throw new Error("Failed to fetch mix", {
        cause: error,
      });
    }

    return convert2mix(data);
  }

  function getShareLink(session: Session, monthlyDate: MonthlyDate): string {
    const { id: userId } = session.user;
    const monthlyStr = monthlyDate2str(monthlyDate);
    return `http://localhost:3000/mixes/${userId}/${monthlyStr.replace("-", "/")}`;
  }

  async function canShareMix(
    session: Session,
    monthlyDate: MonthlyDate,
  ): Promise<boolean> {
    const [start, end] = monthlyDate2DateRange(monthlyDate);

    const { count, error } = await supabase
      .from("mixes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .gt("created_at", start.toISOString())
      .lt("created_at", end.toISOString());

    if (count == null) {
      throw new Error("Failed to fetch mix", {
        cause: error,
      });
    }

    return count === 0;
  }

  return {
    __convert2mix: convert2mix,
    __convert2dbSchema: convert2dbSchema,
    fetchAll,
    fetchSingle,
    add,
    update,
    fetchSingleByUserId,
    getShareLink,
    canShareMix,
  };
}
