"use client";

import { styled as p } from "panda/jsx";
import { useState, type ReactElement } from "react";
import { Button, Card, Image, Text, CloseButton, Group, TextInput, Grid, Divider, ScrollArea } from "@mantine/core";

type SongData = {
  title: string,
  image: string,
  description: string,
  url: string,
  comment: string
}

function SongCard(): ReactElement {
  return (
    <Card padding="xs" radius="md" shadow="sm" withBorder>
      <Card.Section>
        <Image
          height={160}
          src="http://placehold.jp/50x50.png"
        />
      </Card.Section>

      <Group justify="space-between" mt="xs">
        <Text fw={500}>タイトル</Text>
      </Group>

      <Text size="xs">
        コンポスター
      </Text>

      <Button
        fullWidth mt="xs" onClick={() => {
          // mixにこの曲を追加
        }} radius="md">
        追加
      </Button>
    </Card>
  )
}

function SelectSong({ ...songData }: SongData): ReactElement {
  return (
    <Group justify="between-space">
      <Card maw={500} padding="xs" radius="md" shadow="sm" withBorder>
        <Grid>
          <Grid.Col span={4}>
            <Image mah={100} maw={100} radius="md"
              src="http://placehold.jp/50x50.png" />
          </Grid.Col>
          <Grid.Col span={8}>
            <Text fw={500}>{songData.title}</Text>
            <Text fw={500}>{songData.description}</Text>

            <TextInput placeholder="comment" />
          </Grid.Col>
        </Grid>
      </Card>
      <CloseButton />
    </Group>
  )
}

export default function Page(): ReactElement {
  // リアクティブな値
  const [mix, setMix] = useState<SongData[]>([{
    title: "title1",
    image: "image",
    description: "description1",
    url: "url",
    comment: "comment"
  },
  {
    title: "title2",
    image: "image",
    description: "description2",
    url: "url",
    comment: "comment"
  },
  {
    title: "title3",
    image: "image",
    description: "description3",
    url: "url",
    comment: "comment"
  }
  ])

  return (
    <p.main
      m="3"
    >
      {/* <Tabs defaultValue="SoundCloud"
        >
          <Tabs.Panel value="SoundCloud">
            <ScrollArea.Autosize mah={800} mih={300} scrollbars="y">
              <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <SongCard />
                </Grid.Col>
              </Grid>
            </ScrollArea.Autosize>
          </Tabs.Panel>
          <Tabs.Panel value="YouTube Music">
            YouTube Music tab content
          </Tabs.Panel>
          <Tabs.Panel value="Spotify">
            Spotify tab content
          </Tabs.Panel>
          <Tabs.List grow>
            <Tabs.Tab value="SoundCloud">
              SoundCloud
            </Tabs.Tab>
            <Tabs.Tab value="YouTube Music" >
              YouTube Music
            </Tabs.Tab>
            <Tabs.Tab value="Spotify">
              Spotify
            </Tabs.Tab>
          </Tabs.List>
        </Tabs> */}

      <ScrollArea.Autosize mah={600} mih={300} scrollbars="y">
        <Grid grow>
          <Grid.Col span={12}>
            <SelectSong {...mix[0]} />
          </Grid.Col>
          <Grid.Col span={12}>
            <SelectSong {...mix[1]} />
          </Grid.Col>
          <Grid.Col span={12}>
            <SelectSong {...mix[2]} />
          </Grid.Col>1
        </Grid>
      </ScrollArea.Autosize>
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
  )
}
