import { Icon } from "@iconify/react";
import { Button, Code, NumberInput, Switch, TextInput } from "@mantine/core";
import { VStack, HStack, styled as p } from "panda/jsx";
import { type ReactElement, useState, useMemo, useEffect } from "react";
import { validate } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { useMix } from "@/hooks/useMix";
import { type Tables } from "@/types/supabase";
import { getMonthlyDate } from "@/lib/utils";

export function UserMixes(): ReactElement {
  const { session, isLogged } = useAuth();
  const {
    fetchAll,
    fetchSingle,
    add,
    update,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __convert2mix,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __convert2dbSchema,
    fetchSingleByUserId,
  } = useMix();

  const [data, setData] = useState<unknown>();
  const [mix, setMix] = useState<Partial<Tables<"mixes">>>({});
  const [selectedMonthlyDate, setSelectedMonthlyDate] = useState(
    getMonthlyDate(new Date()),
  );
  const [otherTargetMode, setOtherTargetMode] = useState(false);
  const [loading, setLoading] = useState<
    "fetchAll" | "fetchSingle" | "add" | "update"
  >();

  const isInvalidId = useMemo(
    () => mix.id != null && !validate(mix.id) && mix.id.length !== 0,
    [mix.id],
  );
  const isInvalidUserId = useMemo(
    () =>
      mix.user_id != null && !validate(mix.user_id) && mix.user_id.length !== 0,
    [mix.user_id],
  );

  useEffect(() => {
    setMix((prev) => ({
      ...prev,
      user_id: session?.user.id,
    }));
  }, [session?.user.id]);

  if (!isLogged || session == null) {
    return (
      <VStack
        alignItems="start"
        border="1px solid white"
        h="660px"
        p="3"
        w="100%"
      >
        <p.h2 fontSize="2xl" fontWeight="bold">
          User Mixes
        </p.h2>

        <p.div display="grid" h="100%" placeItems="center" w="100%">
          You need to sign in!
        </p.div>
      </VStack>
    );
  }

  return (
    <VStack alignItems="start" border="1px solid white" gap="3" p="3">
      <HStack justifyContent="space-between" w="100%">
        <p.h2 fontSize="2xl" fontWeight="bold">
          User Mixes
        </p.h2>
        <Switch
          checked={otherTargetMode}
          defaultChecked
          label="Search other user's mixes"
          labelPosition="left"
          onChange={(e) => {
            setOtherTargetMode(e.currentTarget.checked);
          }}
        />
      </HStack>

      <p.div
        display="grid"
        gap="3"
        gridTemplateColumns="repeat(auto-fit, minmax(600px, 1fr))"
        w="100%"
      >
        <VStack alignItems="start" w="100%">
          <p.h3>Actions</p.h3>
          <HStack w="100%">
            <Button
              fullWidth
              leftSection={<Icon icon="mdi:expand-all" />}
              loading={loading === "fetchAll"}
              onClick={() => {
                void (async () => {
                  setLoading("fetchAll");
                  const result = await fetchAll(session);
                  setData(result);
                  setLoading(undefined);
                })();
              }}
              variant="filled"
            >
              Fetch all
            </Button>
          </HStack>
          <p.h3>Monthly Date</p.h3>
          <HStack w="100%">
            <NumberInput
              allowDecimal={false}
              disabled={!otherTargetMode}
              label="Year"
              max={new Date().getFullYear()}
              min={2010}
              onChange={(val) => {
                setSelectedMonthlyDate((prev) => ({
                  ...prev,
                  year: Number(val),
                }));
              }}
              placeholder="YYYY"
              value={selectedMonthlyDate.year}
              variant="filled"
              w="100%"
            />
            <NumberInput
              allowDecimal={false}
              disabled={!otherTargetMode}
              label="Month"
              max={12}
              min={1}
              onChange={(val) => {
                setSelectedMonthlyDate((prev) => ({
                  ...prev,
                  month: Number(val),
                }));
              }}
              placeholder="MM"
              value={selectedMonthlyDate.month}
              variant="filled"
              w="100%"
            />
          </HStack>
          <p.h3>Data</p.h3>
          <p.div h="100%" maxH="500px" overflowX="auto" w="100%">
            <Code block h="100%">
              {JSON.stringify(data, null, 2)}
            </Code>
          </p.div>
        </VStack>
        <VStack alignItems="start" w="100%">
          <p.h3>Actions</p.h3>
          <HStack w="100%">
            <Button
              disabled={(() => {
                if (otherTargetMode) {
                  const valid =
                    selectedMonthlyDate != null && validate(mix?.user_id ?? "");
                  return !valid;
                }

                const valid = validate(mix?.id ?? "");
                return !valid;
              })()}
              fullWidth
              leftSection={<Icon icon="mdi:numeric-1-box-multiple" />}
              loading={loading === "fetchSingle"}
              onClick={() => {
                void (async () => {
                  if (otherTargetMode) {
                    const userId = mix?.user_id;
                    if (userId == null || !validate(mix?.user_id ?? "")) {
                      throw new Error("Invalid UUID");
                    }
                    setMix(
                      __convert2dbSchema(
                        await fetchSingleByUserId(userId, selectedMonthlyDate),
                      ),
                    );

                    return;
                  }
                  if (mix?.id == null) throw new Error("Invalid UUID");
                  setLoading("fetchSingle");
                  setMix(
                    __convert2dbSchema(await fetchSingle(session, mix.id)),
                  );
                  setLoading(undefined);
                })();
              }}
              variant="filled"
            >
              Fetch Single
            </Button>
            <Button
              disabled={
                otherTargetMode ||
                !(
                  mix?.user_id != null &&
                  mix?.song_urls != null &&
                  mix?.song_comments != null &&
                  mix?.description != null
                )
              }
              fullWidth
              leftSection={<Icon icon="mdi:plus" />}
              loading={loading === "add"}
              onClick={() => {
                void (async () => {
                  if (
                    !(
                      mix?.user_id != null &&
                      mix?.song_urls != null &&
                      mix?.song_comments != null &&
                      mix?.description != null
                    )
                  ) {
                    throw new Error("Invalid Mix");
                  }

                  setLoading("add");

                  const _data: Pick<
                    Tables<"mixes">,
                    "song_urls" | "song_comments" | "description"
                  > = {
                    song_urls: mix.song_urls,
                    song_comments: mix.song_comments,
                    description: mix.description,
                  };

                  const result = await add(session, {
                    songs: _data.song_urls.map((url, idx) => ({
                      url,
                      comment: _data.song_comments[idx],
                    })),
                    description: _data.description,
                  });
                  setMix(result);
                  setLoading(undefined);
                })();
              }}
              variant="light"
            >
              Add
            </Button>
            <Button
              disabled={
                otherTargetMode ||
                !(
                  mix?.id != null &&
                  validate(mix?.id ?? "") &&
                  mix?.user_id != null &&
                  mix?.song_urls != null &&
                  mix?.song_comments != null &&
                  mix?.description != null &&
                  mix?.created_at != null &&
                  mix?.updated_at != null
                )
              }
              fullWidth
              leftSection={<Icon icon="mdi:account-sync" />}
              loading={loading === "update"}
              onClick={() => {
                void (async () => {
                  if (
                    !(
                      mix?.id != null &&
                      validate(mix?.id ?? "") &&
                      mix?.user_id != null &&
                      mix?.song_urls != null &&
                      mix?.song_comments != null &&
                      mix?.description != null &&
                      mix?.created_at != null &&
                      mix?.updated_at != null
                    )
                  )
                    throw new Error("Invalid Mix");
                  setLoading("update");
                  const _data: Tables<"mixes"> = {
                    id: mix.id,
                    user_id: mix.user_id,
                    song_urls: mix.song_urls,
                    song_comments: mix.song_comments,
                    description: mix.description,
                    created_at: mix.created_at,
                    updated_at: mix.updated_at,
                  };
                  await update(session, __convert2mix(_data));
                  setLoading(undefined);
                })();
              }}
              variant="light"
            >
              Update
            </Button>
          </HStack>
          <p.code>id</p.code>
          <TextInput
            error={isInvalidId ? "Invalid UUID" : undefined}
            onChange={(e) => {
              const val = e.currentTarget.value;

              setMix((prev) => ({
                ...prev,
                id: val,
              }));
            }}
            placeholder="UUID"
            value={mix.id ?? ""}
            w="100%"
          />
          <p.code>user_id</p.code>
          <TextInput
            disabled={!otherTargetMode}
            error={isInvalidUserId ? "Invalid UUID" : undefined}
            onChange={(e) => {
              const val = e.currentTarget.value;

              setMix((prev) => ({
                ...prev,
                user_id: val,
              }));
            }}
            placeholder="UUID"
            value={mix.user_id ?? ""}
            w="100%"
          />
          {(
            [
              "song_urls",
              "song_comments",
              "description",
              "created_at",
              "updated_at",
            ] as const
          ).map((key) => (
            <p.div key={key} w="100%">
              <p.code>{key}</p.code>
              <TextInput
                disabled={key === "created_at" || key === "updated_at"}
                onChange={(e) => {
                  const val = e.currentTarget.value;

                  if (key === "song_urls" || key === "song_comments") {
                    setMix((prev) => ({
                      ...prev,
                      [key]: val.split(","),
                    }));
                    return;
                  }

                  setMix((prev) => ({
                    ...prev,
                    [key]: val,
                  }));
                }}
                value={(() => {
                  if (mix[key] == null) return "";
                  if (key === "song_urls" || key === "song_comments") {
                    return (mix[key] as unknown as string[]).join(",");
                  }
                  return mix[key] ?? "";
                })()}
                w="100%"
              />
            </p.div>
          ))}
        </VStack>
      </p.div>
    </VStack>
  );
}
