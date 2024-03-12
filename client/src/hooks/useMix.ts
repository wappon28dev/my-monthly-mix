/* eslint-disable no-console */
import { type Session } from "@supabase/supabase-js";
import { v4 as uuidV4 } from "uuid";
import supabase from "@/lib/service/supabase";
import { type Tables } from "@/types/supabase";
import { type Override } from "@/types/utils";

export type Mix = Override<
  Tables<"mixes">,
  {
    songs: string[];
    draft: string[];
  }
>;

function convert4db(mix: Mix): Tables<"mixes"> {
  const { songs, draft, ...rest } = mix;
  return {
    songs: mix.songs.join(","),
    draft: mix.draft.join(","),
    ...rest,
  };
}

function convert4app(row: Tables<"mixes">): Mix {
  const { songs, draft, ...rest } = row;
  return {
    songs: row.songs.split(","),
    draft: row.draft.split(","),
    ...rest,
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useMix() {
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

    return data.map(convert4app);
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

    return convert4app(data);
  }

  async function add(
    session: Session,
    mix: Pick<Mix, "songs" | "draft">,
  ): Promise<Mix> {
    const uuid = uuidV4();
    const obj = {
      id: uuid,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...mix,
    };
    const convertedData = convert4db(obj);

    const result = await supabase.from("mixes").insert(convertedData);
    console.log(result);

    return obj;
  }

  async function update(session: Session, mix: Mix): Promise<void> {
    const convertedData = convert4db(mix);
    const result = await supabase
      .from("mixes")
      .update(convertedData)
      .eq("id", mix.id)
      .eq("user_id", session.user.id);

    console.log(result);
  }

  return {
    fetchAll,
    fetchSingle,
    add,
    update,
  };
}
