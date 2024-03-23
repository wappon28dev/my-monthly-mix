"use client";

import { VStack, styled as p } from "panda/jsx";
import { useEffect, useState, type ReactElement } from "react";
import { validate } from "uuid";
import { notFound } from "next/navigation";
import { Button, Progress, Skeleton } from "@mantine/core";
import { css } from "panda/css";
import { Icon } from "@iconify/react";
import ReactPlayer from "react-player";
import { Spotify } from "react-spotify-embed";
import { useMix, type Mix } from "@/hooks/useMix";
import { type ArrayElem } from "@/types/utils";
import { type SongData } from "@/types/res";
import {
  inferSongInfo,
  type SongKind,
  songServices,
  useSongData,
} from "@/hooks/useSongData";

function Preview({
  songUrl,
  songKind,
  isPlaying,
}: {
  songUrl: string;
  songKind: SongKind;
  isPlaying: boolean;
}): ReactElement {
  switch (songKind) {
    case "blank":
      return <p.div>Enter URL to show preview</p.div>;
    case "youtube":
    case "soundcloud":
      return (
        <ReactPlayer
          controls
          height={300}
          playing={isPlaying}
          style={{ borderRadius: "var(--radii-3xl)" }}
          url={songUrl}
          width={300}
        />
      );
    case "spotify":
      return (
        <Spotify
          frameBorder="0"
          height={352}
          link={songUrl}
          play={isPlaying}
          style={{
            overflow: "hidden",
            transform: "translateY(-50px)",
            clipPath: "polygon(0 12.5%, 100% 12.5%, 100% 100%, 0% 100%)",
          }}
          width={300}
        />
      );
    default:
      return <p.div>Currently not supported</p.div>;
  }
}

type Params = {
  userId: string;
  year: string;
  month: string;
};

function validateParams({ userId, year, month }: Params): void | never {
  if (!validate(userId)) {
    notFound();
  }

  if (!(/^\d{4}$/.test(year) && year >= "2000")) {
    notFound();
  }

  if (!(/^\d{2}$/.test(month) && month >= "01" && month <= "12")) {
    notFound();
  }
}

function Song({
  songData,
  comment,
}: {
  songData: SongData | undefined;
  comment: ArrayElem<Mix["songs"]>["comment"] | undefined;
}): ReactElement {
  const needShow = songData == null;
  const service = songServices[songData?.details.kind ?? "blank"];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function PlayButton(): ReactElement {
    return (
      <p.div
        className="play-button"
        left="50%"
        opacity="0"
        position="absolute"
        top="50%"
        transform="translate(-50%, -50%)"
        transition="opacity 0.2s ease-out"
        zIndex="10"
      >
        <Icon height={60} icon="mdi:play" width={60} />
      </p.div>
    );
  }

  function Overlay(): ReactElement {
    return (
      <p.div
        className="overlay"
        cursor="pointer"
        h="100%"
        left="50%"
        onClick={() => {
          setIsPlaying(true);
        }}
        position="absolute"
        rounded="3xl"
        top="50%"
        transform="translate(-50%, -50%)"
        transition="background-color 0.2s ease-out"
        w="100%"
        zIndex="5"
      />
    );
  }

  function EmbedPreview(): ReactElement {
    return (
      <p.div
        className={css({
          "& iframe": {
            borderRadius: "var(--radii-3xl)",
            "& body": {
              backgroundColor: "transparent",
            },
          },
        })}
        h={300}
        left="50%"
        position="absolute"
        rounded="3xl"
        style={{
          zIndex: isPlaying ? 10 : -1,
          display: isPlaying ? "block" : "none",
        }}
        top="50%"
        transform="translate(-50%, -50%)"
        w={300}
      >
        {songData != null && (
          <Preview
            isPlaying={isPlaying}
            songKind={songData.details.kind}
            songUrl={songData.details.url}
          />
        )}
      </p.div>
    );
  }

  function Chips(): ReactElement {
    return (
      <p.a
        alignItems="end"
        className={css({
          _hover: {
            "& > p": { w: "80px" },
          },
        })}
        cursor="pointer"
        display="flex"
        href={songData?.details.url ?? "#"}
        justifyContent="center"
        p="2"
        position="absolute"
        right="-5"
        rounded="full"
        style={{
          backgroundColor: service.color,
        }}
        target="_blank"
        top="-5"
        zIndex="10"
      >
        <p.p
          h="5"
          overflow="hidden"
          transform="translateY(-6px) translateX(12px)"
          transition="width 0.2s ease-out"
          w="0"
        >
          {service.name}
        </p.p>
        <Icon height={30} icon={service.icon} width={30} />
      </p.a>
    );
  }

  return (
    <VStack>
      <Skeleton visible={needShow}>
        <p.div
          _hover={{
            "& .overlay": {
              bg: "rgba(0, 0, 0, 0.4)",
            },
            "& .play-button": {
              opacity: 1,
            },
          }}
          position="relative"
        >
          <p.img
            h={300}
            objectFit="cover"
            rounded="3xl"
            src={songData?.thumbnail ?? ""}
            w={300}
          />
          <PlayButton />
          <Overlay />
          <EmbedPreview />
          <Chips />
        </p.div>
      </Skeleton>
      <Skeleton visible={needShow}>
        <p.h3
          fontSize="xl"
          fontWeight="bold"
          maxW="300px"
          minH="1.5em"
          minW="300px"
          overflow="hidden"
          textAlign="center"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {songData?.title ?? ""}
        </p.h3>
      </Skeleton>
      <Skeleton visible={needShow}>
        <p.p minH="1.5em" minW="200px" textAlign="center">
          {songData?.artists.composer ?? " "}
        </p.p>
      </Skeleton>
      <Skeleton visible={needShow}>
        {comment != null && comment.length !== 0 && (
          <p.p minH="1.5em" minW="200px" textAlign="center">
            <p.div>{comment}</p.div>
          </p.p>
        )}
      </Skeleton>
      <Skeleton visible={needShow}>
        <p.div textAlign="center" w="100%">
          <Button variant="outline">{service.name} で聴く ↗</Button>
        </p.div>
      </Skeleton>
    </VStack>
  );
}

export default function Page({ params }: { params: Params }): ReactElement {
  const { fetchSingleByUserId } = useMix();
  const { fetchSingle } = useSongData();

  const [progress, setProgress] = useState<number>(0);
  const [mix, setMix] = useState<Mix>();
  const [songDataList, setSongData] = useState<SongData[]>();

  validateParams(params);

  async function init(): Promise<void> {
    setProgress(20);
    const _mix = await fetchSingleByUserId(params.userId, {
      year: Number(params.year),
      month: Number(params.month),
    });
    setMix(_mix);
    setProgress((prev) => prev + 20);

    // eslint-disable-next-line no-restricted-syntax
    for await (const song of _mix.songs) {
      console.log("fetching...", song.url);
      const { kind, id } = inferSongInfo(song.url);
      if (id == null) return;

      const songData = await fetchSingle(kind, id);
      setSongData((prev) => [...(prev ?? []), songData]);
      setProgress((prev) => prev + 20);
    }
  }

  useEffect(() => {
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      bgGradient="to-r"
      color="white"
      gradientFrom="purple.950"
      gradientTo="sky.950"
      h="100%"
      p="5"
      w="100%"
    >
      <p.div
        position="fixed"
        style={{
          opacity: progress >= 100 ? 0 : 1,
        }}
        top="86px"
        transition="opacity 0.2s ease-in"
        w="100%"
      >
        <Progress animated striped value={progress} w="100%" />
      </p.div>
      <p.h2 fontSize="2xl" fontWeight="bold" pt="5">
        My Monthly Mix in {params.year}.{params.month}
      </p.h2>
      <p.div gap="5" h="100%" maxW="1200px" w="100%">
        <p.div
          alignItems="center"
          display="grid"
          gap="5"
          gridTemplateColumns="repeat(auto-fill, minmax(330px, 1fr))"
          h="100%"
          mx="auto"
          placeItems="center"
        >
          <Song
            comment={mix?.songs.at(0)?.comment}
            songData={songDataList?.at(0)}
          />
          <Song
            comment={mix?.songs.at(1)?.comment}
            songData={songDataList?.at(1)}
          />
          <Song
            comment={mix?.songs.at(2)?.comment}
            songData={songDataList?.at(2)}
          />
        </p.div>
      </p.div>
    </VStack>
  );
}
