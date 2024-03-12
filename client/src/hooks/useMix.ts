import { type Session } from "@supabase/supabase-js";
import { v4 as uuidV4 } from "uuid";
import supabase from "@/lib/service/supabase";
import { type Tables } from "@/types/supabase";

export type Mix = Pick<Tables<"mixes">, "songs" | "draft">;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useMix() {
  async function fetchAll(): Promise<Array<Tables<"mixes">>> {
    const { data } = await supabase
      .from("mixes")
      .select("*")
      .order("created_at");

    if (data == null) throw new Error("Failed to fetch mixes");
    return data;
  }

  async function add(session: Session, mix: Mix): Promise<void> {
    const uuid = uuidV4();

    const result = await supabase.from("mixes").insert({
      id: uuid,
      user_id: session.user.id,
      ...mix,
    });

    console.log(result);
  }

  return {
    fetchAll,
    add,
  };
}
