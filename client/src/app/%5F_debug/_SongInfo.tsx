"use client";

import { TextInput } from "@mantine/core";
import { HStack, VStack, styled as p } from "panda/jsx";
import { type ReactElement, useState, useMemo, useEffect } from "react";
import ReactPlayer from "react-player";
import { Spotify } from "react-spotify-embed";
import { inferSongInfo, useSongData } from "@/hooks/useSongData";

export function SongInfo(): ReactElement {
  const [loading, setLoading] = useState<"info">();
  const [musicUrl, setMusicUrl] = useState("");
  const songData = useSongData();
  const songInfo = useMemo(() => inferSongInfo(musicUrl), [musicUrl]);

  function Preview(): ReactElement {
    switch (songInfoId) {
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
      minH="500px"
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
            <p.h3>Actions</p.h3>
            <TextInput
              onChange={(e) => {
                setMusicUrl(e.currentTarget.value);
              }}
              placeholder="Music URL"
              value={musicUrl}
              w="100%"
            />
            <p.h3>Song Type</p.h3>
            <p.code>{songInfo.kind}</p.code>
            <p.h3>Song Info</p.h3>
            <HStack w="100%">
              <p.div>
                <p.img
                  alt=""
                  height={120}
                  rounded="lg"
                  src="http://placehold.jp/120x120.png"
                  width={120}
                />
              </p.div>

              <VStack>
                <p.p fontSize="2xl" fontWeight="bold">
                  Title
                </p.p>
              </VStack>
            </HStack>
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
