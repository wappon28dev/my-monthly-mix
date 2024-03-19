import { VStack, styled as p } from "panda/jsx";
import { type ReactElement } from "react";

export default function Page(): ReactElement {
  return (
    <p.div
      bgGradient="to-r"
      color="white"
      display="grid"
      gradientFrom="purple.950"
      gradientTo="sky.950"
      h="100%"
      p="5"
      placeItems="center"
      w="100%"
    >
      <VStack>
        <p.h1 fontSize="3xl" fontWeight="bold">
          404
        </p.h1>
        <p.p>Page not found</p.p>
      </VStack>
    </p.div>
  );
}
