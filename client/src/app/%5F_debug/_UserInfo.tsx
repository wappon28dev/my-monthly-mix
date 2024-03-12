import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Code } from "@mantine/core";
import { VStack, HStack, styled as p } from "panda/jsx";
import { type ReactElement, useState } from "react";
import { waitMs } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function UserInfo(): ReactElement {
  const { session, signIn, signOut, getUserMetadata, isLogged } = useAuth();
  const [loading, setLoading] = useState<"signIn" | "signOut" | "update">();

  return (
    <VStack
      alignItems="start"
      border="1px solid"
      borderColor="white"
      gap="3"
      p="3"
    >
      <p.h2 fontSize="2xl" fontWeight="bold">
        User Info
      </p.h2>
      <p.div
        display="grid"
        gap="3"
        gridTemplateColumns="repeat(auto-fit, minmax(600px, 1fr))"
        w="100%"
      >
        <p.div w="100%">
          <VStack alignItems="start" w="100%">
            <p.h3>Actions</p.h3>
            <HStack w="100%">
              <Button
                fullWidth
                leftSection={<Icon icon="mdi:login" />}
                loading={loading === "signIn"}
                onClick={() => {
                  void (async () => {
                    setLoading("signIn");
                    await signIn();
                    setLoading(undefined);
                  })();
                }}
                rightSection={<Icon icon="mdi:launch" />}
                variant="filled"
              >
                Sign in
              </Button>
              <Button
                fullWidth
                leftSection={<Icon icon="mdi:login" />}
                loading={loading === "signOut"}
                onClick={() => {
                  void (async () => {
                    setLoading("signOut");
                    await signOut();
                    setLoading(undefined);
                  })();
                }}
                variant="light"
              >
                Sign out
              </Button>
              <Button
                fullWidth
                leftSection={<Icon icon="mdi:account-sync" />}
                loading={loading === "update"}
                onClick={() => {
                  void (async () => {
                    setLoading("update");
                    await waitMs(1000);
                    setLoading(undefined);
                  })();
                }}
                variant="light"
              >
                Update
              </Button>
            </HStack>
          </VStack>
          <p.h3>Metadata</p.h3>
          <p.div maxW="100%" overflowX="auto">
            <Code block h="auto" style={{ height: "100%" }}>
              {JSON.stringify(
                isLogged ? getUserMetadata() : "<not logged>",
                null,
                2,
              )}
            </Code>
          </p.div>
        </p.div>
        <p.div>
          <p.h3>Session User</p.h3>
          <p.div h="325px" overflow="auto">
            <Code block>
              {JSON.stringify(
                isLogged ? session?.user : "<not logged>",
                null,
                2,
              )}
            </Code>
          </p.div>
        </p.div>
      </p.div>
    </VStack>
  );
}
