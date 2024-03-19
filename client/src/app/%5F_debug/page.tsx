"use client";

import { type ReactElement } from "react";
import { VStack, styled as p } from "panda/jsx";
import { UserInfo } from "./_UserInfo";
import { UserMixes } from "./_UserMixes";
import { SongInfo } from "./_SongInfo";
import { DraftMix } from "./_DraftMix";
import { FetchUserMix } from "./_FetchUserMix";

export default function Page(): ReactElement {
  return (
    <p.div
      bgGradient="to-r"
      color="white"
      gradientFrom="purple.950"
      gradientTo="sky.950"
      h="100%"
      p="5"
      w="100%"
    >
      <VStack alignItems="left" gap="5" w="100%">
        <p.h1 fontSize="3xl" fontWeight="bold">
          Debug Mode
        </p.h1>
        <UserInfo />
        <UserMixes />
        <DraftMix />
        <SongInfo />
        <FetchUserMix />
      </VStack>
    </p.div>
  );
}
