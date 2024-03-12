"use client";

import { VStack, styled as p } from "panda/jsx";
import { type ReactElement } from "react";
import { Button } from "@mantine/core";
import { Icon } from "@iconify/react";
import { useAuth } from "@/hooks/useAuth";

export default function Page(): ReactElement {
  const { signIn, isLogged } = useAuth();

  function LoginButton(): ReactElement {
    return (
      <Button
        onClick={() => {
          void signIn();
        }}
        rightSection={<Icon icon="mdi:login" />}
        size="xl"
        variant="filled"
      >
        Google でログイン
      </Button>
    );
  }

  function CreationButton(): ReactElement {
    return (
      <Button
        leftSection={<Icon icon="mdi:creation" />}
        onClick={() => {
          throw new Error("not implemented yet");
        }}
        size="xl"
        variant="filled"
      >
        My Mix を作る
      </Button>
    );
  }

  return (
    <p.main
      bgGradient="to-r"
      display="grid"
      gradientFrom="purple.900"
      gradientTo="sky.900"
      h="100%"
      placeItems="center"
      w="100%"
    >
      <VStack transform="translateY(-40px)" /* header size */>
        <p.h1
          color="white"
          fontSize={{
            base: "7xl",
            mdDown: "5xl",
          }}
          fontWeight="black"
        >
          My Monthly Mix
        </p.h1>
        {isLogged ? <CreationButton /> : <LoginButton />}
      </VStack>
    </p.main>
  );
}
