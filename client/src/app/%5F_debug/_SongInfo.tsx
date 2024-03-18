"use client";

import { Code, TextInput, Loader } from "@mantine/core";
import { HStack, VStack, styled as p } from "panda/jsx";
import { type ReactElement, useState, useMemo, useEffect } from "react";
import ReactPlayer from "react-player";
import { Spotify } from "react-spotify-embed";
import { type SongData } from "@api/types/res";
import { Icon } from "@iconify/react";
import { inferSongInfo, useSongData } from "@/hooks/useSongData";

export function SongInfo(): ReactElement {
  const [loading, setLoading] = useState<"data">();
  const [musicUrl, setMusicUrl] = useState("");
  const [songData, setSongData] = useState<SongData>();
  const { fetchSingle } = useSongData();
  const songInfo = useMemo(() => inferSongInfo(musicUrl), [musicUrl]);

  useEffect(() => {
    if (
      loading === "data" ||
      songInfo.id === "blank" ||
      songInfo.id === "other" ||
      songInfo.id == null
    ) {
      return;
    }

    setLoading("data");
    void fetchSingle(songInfo.kind, songInfo.id)
      .then(setSongData)
      .finally(() => {
        setLoading(undefined);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicUrl]);

  function Preview(): ReactElement {
    switch (songInfo.kind) {
      case "blank":
        return <p.div>Enter URL to show preview</p.div>;
      case "youtube":
      case "soundcloud":
        return <ReactPlayer url={musicUrl} />;
      case "spotify":
        return <Spotify link={musicUrl} />;
      default:
        return <p.div>Currently not supported</p.div>;
    }
  }

  return (
    <VStack
      alignItems="start"
      border="1px solid"
      borderColor="white"
      gap="3"
      minH="650px"
      p="3"
    >
      <p.h2 fontSize="2xl" fontWeight="bold">
        Song Info
      </p.h2>
      <p.div
        display="grid"
        gap="3"
        gridTemplateColumns="repeat(auto-fit, minmax(600px, 1fr))"
        w="100%"
      >
        <p.div w="100%">
          <VStack alignItems="start" w="100%">
            <HStack alignItems="start" gap="5" w="100%">
              <p.div w="fit-content">
                <p.h3>Song Type</p.h3>
                <p.code>{songInfo.kind}</p.code>
              </p.div>
              <p.div flex="1">
                <p.h3>Song URL</p.h3>
                <TextInput
                  disabled={loading === "data"}
                  onChange={(e) => {
                    setMusicUrl(e.currentTarget.value);
                  }}
                  placeholder="URL"
                  rightSection={
                    loading === "data" && <Loader color="white" size="sm" />
                  }
                  value={musicUrl}
                  w="100%"
                />
              </p.div>
            </HStack>
            <p.h3>Song Info</p.h3>
            <HStack w="100%">
              <p.div>
                {songData?.thumbnail == null ? (
                  <p.div
                    bg="gray.300"
                    border="1px solid white"
                    display="grid"
                    height={120}
                    placeItems="center"
                    rounded="lg"
                    width={120}
                  >
                    <Icon color="gray" height={40} icon="mdi:image" />
                  </p.div>
                ) : (
                  <p.img
                    alt=""
                    height={120}
                    objectFit="cover"
                    rounded="lg"
                    src={songData.thumbnail}
                    width={120}
                  />
                )}
              </p.div>

              <VStack alignItems="start">
                <HStack>
                  <Icon height={25} icon="mdi:music-note" />
                  {songData?.title ?? "Title"}
                </HStack>
                <HStack>
                  <Icon height={25} icon="mdi:account-music" />
                  {songData?.artists.composer ?? "Composer"}
                </HStack>
                <HStack>
                  <Icon height={25} icon="mdi:bookmark-music" />
                  {songData?.tags.join(", ") ?? "Tags"}
                </HStack>
              </VStack>
            </HStack>
            <p.h3>Song Data</p.h3>
            <p.div overflowX="auto" w="100%">
              <Code block h="auto" style={{ height: "100%" }}>
                {JSON.stringify(songData ?? "<no data>", null, 2)}
              </Code>
            </p.div>
          </VStack>
        </p.div>
        <p.div w="100%">
          <VStack alignItems="start" w="100%">
            <p.h3>Preview</p.h3>
            <p.div w="100%">
              <Preview />
            </p.div>
          </VStack>
        </p.div>
      </p.div>
    </VStack>
  );
}
