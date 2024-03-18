"use client";

import { styled as p } from "panda/jsx";
import { useEffect, useState, type ReactElement, useMemo } from "react";
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
  title,
  thumbnail,
  artist,
  kind,
}: {
  index: number;
  handlerDeleteSong: (key: number) => void;
  title: string;
  thumbnail: string;
  artist: string;
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
                {artist}
              </Text>
              <TextInput placeholder="comment" />
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
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`) ?? false;
  const [share, setShare] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [mix, setMix] = useState<SongData[]>([]);

  // ButtonMsgの変更
  useEffect(() => {
    if (mix.length === 3) {
      setMsg("Share");
    } else if (mix.length < 3) {
      setMsg("Select 3 songs");
    } else {
      setMsg("Delete a song to share");
    }
  }, [mix]);

  // 曲追加Handler
  const handlerAddSong = (newSong: SongData): void => {
    setMix([...mix, newSong]);
  };

  // 曲削除Handler
  const handlerDeleteSong = (key: number): void => {
    setMix(mix.filter((_, j) => j !== key));
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
          {mix.map((songData, i) => (
            /* eslint-disable */
            <SelectedSong
              artist={songData.artists.composer.join(", ")}
              handlerDeleteSong={handlerDeleteSong}
              thumbnail={songData.thumbnail}
              index={i}
              kind={songData.details.kind}
              title={songData.title}
            />
          ))}
          <AdderSong handlerAddSong={handlerAddSong} />
        </ScrollArea.Autosize>
      </Center>
      <p.div position="fixed" bottom="0" mb={5} w="full">
        <Divider my="md" />
        <Center>
          <Flex align="end">
            <Button
              loading={share}
              data-disabled={mix.length !== 3 || share === true}
              onClick={() => {
                if (mix.length !== 3) return;
                console.log(mix);
                setShare(true);
                setTimeout(() => {
                  setShare(false);
                  setMsg("next post is XXXX/XX/XX");
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
