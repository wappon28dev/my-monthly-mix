import { VStack, styled as p } from "panda/jsx";
import { type ReactElement } from "react";
import { Button } from "@mantine/core";
import { token } from "panda/tokens";

export default function Pages(): ReactElement {
  return (
    <p.main
      bgGradient="to-br"
      display="grid"
      gradientFrom="purple.900"
      gradientTo="sky.900"
      h="100%"
      placeItems="center"
      w="100%"
    >
      <VStack>
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
        <Button color={token("colors.purple.500")} size="xl" variant="filled">
          これはボタンなんだよね
        </Button>
      </VStack>
    </p.main>
  );
}
