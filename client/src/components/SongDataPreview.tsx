import { Icon } from "@iconify/react/dist/iconify.js";
import { HStack, VStack, styled as p } from "panda/jsx";
import { type ReactElement } from "react";
import { type SongData } from "@/types/res";

export function SongDataPreview({
  songData,
}: {
  songData: SongData | undefined;
}): ReactElement {
  return (
    <p.div>
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
    </p.div>
  );
}
