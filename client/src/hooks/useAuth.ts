/* eslint-disable no-console */
import { type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "@/lib/service/supabse";
import { type UserMetadata } from "@/types/user";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAuth() {
  const [session, setSession] = useState<Session>();
  const isLogged = session != null;

  useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange(
      (_, _session) => {
        setSession(_session ?? undefined);
      },
    );

    return () => {
      authData.subscription.unsubscribe();
    };
  }, []);

  const getUserMetadata = (): UserMetadata => {
    if (!isLogged) throw new Error("User is not logged in");
    return session.user.user_metadata as UserMetadata;
  };

  const signIn = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.warn(error);
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    console.warn(error);
  };

  return { signIn, signOut, session, isLogged, getUserMetadata };
}
