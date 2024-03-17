"use client";

import { styled as p } from "panda/jsx";
import { useEffect, useState, type ReactElement } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Modal,
  FocusTrap,
  CopyButton,
  Card,
  Image,
  ActionIcon,
  Text,
  CloseButton,
  Center,
  TextInput,
  Grid,
  Divider,
  ScrollArea,
  Badge,
  Group,
  Flex,
} from "@mantine/core";

import type { SongData } from "@api/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSongData } from "../../hooks/useSongData";

function NotSelectedSong({
  handlerAddSong,
}: {
  handlerAddSong: (songData: SongData) => void;
}): ReactElement {
  const [url, setUrl] = useState<string>();

  const { fetchSingleMock } = useSongData();
  return (
    <p.div
      _hover={{
        transform: "scale(1.05)",
      }}
      transition="all 0.2s ease-in-out"
    >
      <Card m={10} maw={800} padding="xs" radius="md" shadow="sm" withBorder>
        <Grid>
          <Grid.Col span={4}>
            <Image
              mah={100}
              maw={100}
              radius="md"
              src="http://placehold.jp/50x50.png"
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <TextInput
              onChange={(event) => {
                setUrl(event.currentTarget.value);
              }}
              placeholder="URL..."
              value={url ?? ""}
            />
            <Button
              onClick={() => {
                void (async () => {
                  handlerAddSong(await fetchSingleMock());
                })();
              }}
            >
              Add
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </p.div>
  );
}

function SelectedSong({
  index,
  handlerDeleteSong,
  title,
  thumbnail,
  composer,
}: {
  index: number;
  handlerDeleteSong: (key: number) => void;
  title: string;
  thumbnail: string;
  composer: string;
}): ReactElement {
  const musicService = [
    {
      name: "SoundCloud",
      icon: "mdi:soundcloud",
      color: "orange",
    },
    {
      name: "Spotify",
      icon: "mdi:spotify",
      color: "green",
    },
    {
      name: "Youtube Music",
      icon: "material-symbols:youtube-music",
      color: "red",
    },
    // {
    //   name: "Apple Music",
    //   color: "pink",
    // },
    // {
    //   name: "Amazon Music",
    //   color: "blue",
    // },
  ];
  return (
    <p.div
      _hover={{
        transform: "scale(1.05)",
      }}
      transition="all 0.2s ease-in-out"
    >
      <Card m={10} maw={1000} padding="xs" radius="md" shadow="sm" withBorder>
        <Grid>
          <Grid.Col span={11}>
            <Grid>
              <Grid.Col span={3}>
                <Image
                  mah={100}
                  maw={100}
                  radius="md"
                  src={thumbnail ?? "http://placehold.jp/50x50.png"}
                />
              </Grid.Col>
              <Grid.Col span={9}>
                <Grid my={3}>
                  <Grid.Col span={8}>
                    <Text fw={800}>{title} </Text>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    {/* サービスごとに色変えたい */}
                    <Badge>音楽サービス名</Badge>
                  </Grid.Col>
                </Grid>
                <Text fw={500} my={7} size="sm">
                  {composer}
                </Text>
                <TextInput placeholder="comment" />
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={1}>
            <CloseButton
              onClick={() => {
                handlerDeleteSong(index);
              }}
            />
          </Grid.Col>
        </Grid>
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
              composer={songData.artists.composer.join(", ")}
              handlerDeleteSong={handlerDeleteSong}
              thumbnail={songData.thumbnail}
              index={i}
              title={songData.title}
            />
          ))}
          <NotSelectedSong handlerAddSong={handlerAddSong} />
        </ScrollArea.Autosize>
      </Center>
      <p.div position="fixed" bottom="0" mb={5} w="full">
        <Divider my="md" />
        <Center>
          <Flex align="end">
            <Button
              fullWidth
              maw={300}
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
