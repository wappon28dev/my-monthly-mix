"use client";

import { TextInput } from "@mantine/core";
import { VStack, styled as p } from "panda/jsx";
import { type ReactElement, useState, useMemo } from "react";
import { Spotify } from "react-spotify-embed";
import { detectSongKind } from "@/lib/detect-song.ts";

export function MusicInfo(): ReactElement {
  const [loading, setLoading] = useState<"info">();
  const [musicUrl, setMusicUrl] = useState("");
  const songKind = useMemo(() => detectSongKind(musicUrl), [musicUrl]);

  function Preview(): ReactElement {
    switch (songKind) {
      case "spotify":
        return <Spotify link={musicUrl} />;
      case "blank":
        return <p.div>Enter URL to show preview</p.div>;
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
      p="3"
    >
      <p.h2 fontSize="2xl" fontWeight="bold">
        Music Info
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
          </VStack>
          <p.h3>Metadata</p.h3>
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
