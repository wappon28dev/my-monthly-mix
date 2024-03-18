/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import { type Session } from "@supabase/supabase-js";
import { v4 as uuidV4 } from "uuid";
import supabase from "@/lib/service/supabase";
import { type Tables } from "@/types/supabase";
import { type OmitStrict } from "@/types/utils";

export type Mix = OmitStrict<Tables<"mixes">, "song_urls" | "song_comments"> & {
  songs: Array<{
    url: string;
    comment: string;
  }>;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useMix() {
  function convert2mix(data: Tables<"mixes">): Mix {
    return {
      ...data,
      songs: data.song_urls.map((url, idx) => ({
        url,
        comment: data.song_comments[idx],
      })),
    };
  }

  function convert2dbSchema(mix: Mix): Tables<"mixes"> {
    return {
      ...mix,
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
    const uuid = uuidV4();
    const data = {
      id: uuid,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...mix,
    };

    const result = await supabase.from("mixes").insert(convert2dbSchema(data));
    console.log(result);

    return data;
  }

  async function update(session: Session, mix: Mix): Promise<void> {
    const data = convert2dbSchema(mix);

    const result = await supabase
      .from("mixes")
      .update(data)
      .eq("id", mix.id)
      .eq("user_id", session.user.id);

    console.log(result);
  }

  return {
    __convert2mix: convert2mix,
    __convert2dbSchema: convert2dbSchema,
    fetchAll,
    fetchSingle,
    add,
    update,
  };
}
