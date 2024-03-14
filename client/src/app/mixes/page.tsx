"use client";

import { styled as p } from "panda/jsx";
import { useState, type ReactElement } from "react";
import {
  Button,
  Card,
  Image,
  Text,
  CloseButton,
  Group,
  Center,
  TextInput,
  Grid,
  Divider,
  ScrollArea,
  Badge,
} from "@mantine/core";

type SongData = {
  title: string;
  image: string;
  description: string;
  url: string;
  comment: string;
};

function NotSelectedSong({
  handlerSetMix,
}: {
  handlerSetMix: (songData: SongData) => void;
}): ReactElement {
  const [url, setUrl] = useState<string>();
  return (
    <Card maw={800} padding="xs" radius="md" shadow="sm" withBorder>
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
          <Text fw={500}>{url ?? "text"}</Text>
          <TextInput
            onChange={(event) => {
              setUrl(event.currentTarget.value);
            }}
            placeholder="URL..."
            value={url ?? ""}
          />
          <Button
            onClick={() => {
              handlerSetMix({
                title: "title",
                image: "image",
                description: "description3",
                url: url ?? "url",
                comment: "comment",
              });
              setUrl(undefined);
            }}
          >
            Add
          </Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

function SelectedSong(props: SongData): ReactElement {
  const songData = props;
  return (
    <Card m={10} maw={800} padding="xs" radius="md" shadow="sm" withBorder>
      <Grid>
        <Grid.Col span={11}>
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
              <Grid>
                <Grid.Col span={4}>
                  <Text fw={500}>{songData.title}</Text>
                </Grid.Col>
                <Grid.Col offset={3} span={4}>
                  <Badge>音楽サービス名</Badge>
                </Grid.Col>
              </Grid>
              <Text fw={500} size="sm">
                {songData.description}
              </Text>
              <Text component="div" fw={500} lineClamp={1} size="xs">
                <p>{songData.url}</p>
              </Text>
              <TextInput placeholder="comment" />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={1}>
          <CloseButton />
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default function Page(): ReactElement {
  const [mix, setMix] = useState<SongData[]>([
    {
      title: "title1",
      image: "image",
      description: "description1",
      url: "url1",
      comment: "comment",
    },
    {
      title: "title2",
      image: "image",
      description: "description2",
      url: "url2",
      comment: "comment",
    },
  ]);

  const handlerSetMix = (newSong: SongData): void => {
    setMix([...mix, newSong]);
  };

  return (
    <p.main m="3">
      <Center>
        <ScrollArea.Autosize mah={600} mih={300} scrollbars="y">
          {/* eslint-disable-next-line react/no-array-index-key */}
          {mix.map((songData, i) => (
            <SelectedSong key={i} {...songData} />
          ))}
          <NotSelectedSong handlerSetMix={handlerSetMix} />
        </ScrollArea.Autosize>
      </Center>
      <Divider my="md" />
      <Button
        fullWidth
        onClick={() => {
          // throw new Error("not implemented yet");
        }}
        size="xl"
      >
        Share
      </Button>
    </p.main>
  );
}
