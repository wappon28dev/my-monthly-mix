"use client";

import { useEffect, useState, type ReactElement } from "react";
import { HStack, VStack, styled as p } from "panda/jsx";
import { Icon } from "@iconify/react";
import { Button, Loader, Popover } from "@mantine/core";
import { useAuth } from "@/hooks/useAuth";

export function Header(): ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const { signIn, signOut, getUserMetadata, isLogged } = useAuth();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  function Avatar(): ReactElement {
    if (!isLogged) {
      return (
        <p.div
          bg="white"
          display="grid"
          height={10}
          placeItems="center"
          rounded="full"
          width={10}
        >
          <Icon color="gray" height={30} icon="mdi:account" />
        </p.div>
      );
    }

    const metaData = getUserMetadata();
    return (
      <p.div>
        <p.img
          alt={metaData.full_name}
          height={10}
          rounded="full"
          src={metaData.avatar_url}
          width={10}
        />
      </p.div>
    );
  }

  function UserInfo(): ReactElement {
    if (!isLogged) {
      return (
        <VStack gap="3">
          <VStack gap="0">
            <p.p>ログインしましょう！！！</p.p>
          </VStack>
          <Button
            onClick={() => {
              void signIn();
            }}
            rightSection={<Icon icon="mdi:login" />}
            size="sm"
          >
            Google でログイン
          </Button>
        </VStack>
      );
    }

    const metaData = getUserMetadata();
    return (
      <VStack gap="3">
        <VStack gap="0">
          <p.p>{metaData.full_name}</p.p>
          <p.p>{metaData.email}</p.p>
        </VStack>
        <Button
          onClick={() => {
            void signOut();
          }}
          rightSection={<Icon icon="mdi:logout" />}
          size="sm"
        >
          ログアウト
        </Button>
      </VStack>
    );
  }

  return (
    <p.header
      bgGradient="to-r"
      display="grid"
      gradientFrom="purple.900"
      gradientTo="sky.900"
      p="5"
      position="sticky"
      top={0}
    >
      <HStack justifyContent="space-between">
        <p.a color="white" fontSize="3xl" fontWeight="black" href="/">
          My Monthly Mix
        </p.a>

        <Popover
          arrowSize={15}
          offset={{ mainAxis: 20, crossAxis: -100 }}
          position="bottom"
          shadow="md"
          width={250}
          withArrow
        >
          <Popover.Target>
            <p.div cursor="pointer" position="relative">
              <Avatar />
              <p.div
                position="absolute"
                right={0}
                scale="1.2"
                style={{
                  opacity: isLoading ? 1 : 0,
                }}
                top={0}
                transition="opacity 0.2s"
              >
                <Loader color="purple.3" size={40} />
              </p.div>
            </p.div>
          </Popover.Target>
          <Popover.Dropdown>
            <UserInfo />
          </Popover.Dropdown>
        </Popover>
      </HStack>
    </p.header>
  );
}
