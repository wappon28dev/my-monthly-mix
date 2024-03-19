"use client";

import { styled as p } from "panda/jsx";
import { useState, type ReactElement, useMemo } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  Button,
  Modal,
  FocusTrap,
  em,
  Title,
  CopyButton,
  Card,
  ActionIcon,
  Text,
  CloseButton,
  Center,
  TextInput,
  Divider,
  ScrollArea,
  Badge,
  Group,
  Flex,
} from "@mantine/core";
import type { SongData } from "@api/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  inferSongInfo,
  useSongData,
  type SongKind,
  songServices,
} from "@/hooks/useSongData";
import { useDraftMix } from "@/hooks/useDraftMix";
import { getMonthlyDate } from "@/lib/utils";

function AdderSong({
  handlerAddSong,
}: {
  handlerAddSong: (songData: SongData) => void;
}): ReactElement {
  const [songUrl, setSongUrl] = useState<string>("");
  const { fetchSingle } = useSongData();
  const songInfo = useMemo(() => inferSongInfo(songUrl), [songUrl]);

  return (
    <Center>
      <Card padding="xs" radius="md" shadow="sm" withBorder>
        <Flex align="center">
          <TextInput
            onChange={(event) => {
              setSongUrl(event.currentTarget.value);
            }}
            placeholder="URL..."
            value={songUrl ?? ""}
          />
          <ActionIcon
            m={10}
            onClick={() => {
              if (songUrl === "") return;
              void (async () => {
                if (songInfo.id == null) return;
                handlerAddSong(await fetchSingle(songInfo.kind, songInfo.id));
                setSongUrl("");
              })();
            }}
            size="md"
          >
            <Icon icon="mdi:check" />
          </ActionIcon>
        </Flex>
      </Card>
    </Center>
  );
}

function SelectedSong({
  index,
  handlerDeleteSong,
  handlerChangeComment,
  title,
  thumbnail,
  artists,
  kind,
  comment,
}: {
  index: number;
  handlerDeleteSong: (key: number) => void;
  handlerChangeComment: (key: number, comment: string) => void;
  title: string;
  thumbnail: string;
  artists: string;
  comment: string;
  kind: SongKind;
}): ReactElement {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`) ?? false;
  return (
    <p.div
      _hover={{
        transform: "scale(1.05)",
      }}
      mx={isMobile ? 0 : 10}
      transition="all 0.2s ease-in-out"
    >
      <Card m={10} maw={800} padding="xs" radius="md" shadow="sm" withBorder>
        <Flex direction="row">
          <Flex align="center" direction={isMobile ? "column" : "row"} gap="md">
            <p.img
              alt=""
              height={isMobile ? 300 : 145}
              objectFit="cover"
              rounded="md"
              src={thumbnail ?? "http://placehold.jp/50x50.png"}
              width={isMobile ? 300 : 145}
            />
            <p.div>
              <Flex direction="column" gap="xs" mt={isMobile ? 0 : 3}>
                <Badge color={songServices[kind].color}>
                  <Flex align="center" justify="flex-start" m={5}>
                    <Icon
                      height={50}
                      icon={songServices[kind].icon}
                      width={50}
                    />
                    {songServices[kind].name}
                  </Flex>
                </Badge>
                <Title lineClamp={2} order={5} w={260}>
                  {title}
                </Title>
              </Flex>
              <Text fw={500} my={7} size="sm">
                {artists}
              </Text>
              <TextInput
                onChange={(event) => {
                  handlerChangeComment(index, event.currentTarget.value);
                }}
                placeholder="comment"
                value={comment}
              />
            </p.div>
          </Flex>
          <CloseButton
            ml={10}
            onClick={() => {
              handlerDeleteSong(index);
            }}
          />
        </Flex>
      </Card>
    </p.div>
  );
}

function ShareModal(): ReactElement {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon
        aria-label="Open in a Modal"
        component="a"
        m={10}
        onClick={open}
        size="xl"
      >
        <Icon icon="mdi:share-variant" />
      </ActionIcon>
      <Modal
        onClose={close}
        opened={opened}
        size="md"
        title="Share this mix!!!"
        withCloseButton={false}
      >
        <FocusTrap.InitialFocus />
        <Divider mb="sm" />
        SNSでシェア
        <Group>
          <Button fullWidth>Twitter</Button>
          <Button fullWidth>Instagram</Button>
          <Button fullWidth>Facebook</Button>
          <Button fullWidth>LINE</Button>
          <Button fullWidth>Mail</Button>
        </Group>
        <Divider my="md" />
        直接URLをコピー
        <CopyButton value="このページのURL">
          {({ copied, copy }) => (
            <Button color={copied ? "teal" : "blue"} onClick={copy} pl={0}>
              <TextInput mr={15} placeholder="このページのURL" />
              {copied ? "Copied url" : "Copy url"}
            </Button>
          )}
        </CopyButton>
      </Modal>
    </>
  );
}

export default function Page(): ReactElement {
  const [share, setShare] = useState<boolean>(false);
  const { $draftMix, draftMix } = useDraftMix(getMonthlyDate(new Date()));

  // ButtonMsgの変更
  const msg = useMemo(() => {
    if (draftMix.length === 3) {
      return "Share";
    }
    if (draftMix.length < 3) {
      return "Select 3 songs";
    }
    return "Delete a song to share";
  }, [draftMix]);

  // 曲追加Handler
  const handlerAddSong = (newSong: SongData): void => {
    $draftMix.set([
      ...draftMix,
      {
        userInput: {
          comment: "",
        },
        songData: newSong,
      },
    ]);
  };

  // 曲削除Handler
  const handlerDeleteSong = (key: number): void => {
    $draftMix.set(draftMix.filter((_, j) => j !== key));
  };

  // 曲Comment変更Handler
  const handlerChangeComment = (key: number, comment: string): void => {
    $draftMix.set(
      draftMix.map((song, j) => {
        if (j === key) {
          return {
            userInput: {
              comment,
            },
            songData: song.songData,
          };
        }
        return song;
      })
    );
  };

  return (
    <p.main m="3">
      <Center>
        <ScrollArea.Autosize
          scrollbars="y"
          style={{
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          {draftMix.map((song, i) => (
            /* eslint-disable-next-line react/jsx-key */
            <SelectedSong
              artists={song.songData.artists.composer.join(", ")}
              comment={song.userInput.comment}
              handlerChangeComment={handlerChangeComment}
              handlerDeleteSong={handlerDeleteSong}
              index={i}
              kind={song.songData.details.kind}
              thumbnail={song.songData.thumbnail}
              title={song.songData.title}
            />
          ))}
          <AdderSong handlerAddSong={handlerAddSong} />
        </ScrollArea.Autosize>
      </Center>
      <p.div bottom="0" mb={5} position="fixed" w="full">
        <Divider my="md" />
        <Center>
          <Flex align="end">
            <Button
              data-disabled={draftMix.length !== 3 || share}
              loading={share}
              onClick={() => {
                if (draftMix.length !== 3) return;
                setShare(true);
                setTimeout(() => {
                  setShare(false);
                }, 2000);
              }}
              size="xl"
            >
              {msg}
            </Button>
            <ShareModal />
          </Flex>
        </Center>
      </p.div>
    </p.main>
  );
}
