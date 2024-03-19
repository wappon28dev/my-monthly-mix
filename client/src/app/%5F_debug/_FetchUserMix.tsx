"use client";

import { HStack, VStack, styled as p } from "panda/jsx";
import { type ReactElement, useState, useMemo } from "react";
import { Button, Code, Loader, NumberInput, TextInput } from "@mantine/core";
import { Icon } from "@iconify/react";
import { validate } from "uuid";
import { useDraftMix } from "@/hooks/useDraftMix";
import {
  getLocalStorageKey,
  getMonthlyDate,
  monthlyDate2str,
} from "@/lib/utils";
import { SongData } from "@/types/res";
import { type Mix } from "@/hooks/useMix";

export function FetchUserMix(): ReactElement {
  const [loading, setLoading] = useState<"userMix" | "songData">();

  const [userId, setUserId] = useState("");
  const [selectedMonthlyDate, setSelectedMonthlyDate] = useState(
    getMonthlyDate(new Date()),
  );
  const [mix, setMix] = useState<Mix>();

  const isInvalidId = useMemo(
    () => userId != null && !validate(userId) && userId.length !== 0,
    [userId],
  );

  return (
    <VStack
      alignItems="start"
      border="1px solid"
      borderColor="white"
      gap="3"
      h="100%"
      p="3"
    >
      <p.h2 fontSize="2xl" fontWeight="bold">
        Fetch External User Mix
      </p.h2>
      <p.div
        display="grid"
        gap="3"
        gridTemplateColumns="repeat(auto-fit, minmax(600px, 1fr))"
        h="100%"
        w="100%"
      >
        <VStack alignItems="start" h="100%">
          <p.h3>User ID</p.h3>
          <TextInput
            disabled={loading === "userMix"}
            error={isInvalidId ? "Invalid UUID" : undefined}
            onChange={(e) => {
              setUserId(e.currentTarget.value);
            }}
            placeholder="UUID"
            rightSection={
              loading === "userMix" && <Loader color="white" size="sm" />
            }
            value={userId}
            w="100%"
          />

          <HStack w="100%">
            <NumberInput
              allowDecimal={false}
              label="Year"
              max={new Date().getFullYear()}
              min={2010}
              onChange={(val) => {
                setSelectedMonthlyDate((prev) => ({
                  ...prev,
                  year: Number(val),
                }));
              }}
              placeholder="YYYY"
              value={selectedMonthlyDate.year}
              variant="filled"
              w="100%"
            />
            <NumberInput
              allowDecimal={false}
              label="Month"
              max={12}
              min={1}
              onChange={(val) => {
                setSelectedMonthlyDate((prev) => ({
                  ...prev,
                  month: Number(val),
                }));
              }}
              placeholder="MM"
              value={selectedMonthlyDate.month}
              variant="filled"
              w="100%"
            />
          </HStack>
          <p.h3>Actions</p.h3>
          <HStack w="100%">
            <Button
              disabled={
                !isInvalidId ||
                userId.length === 0 ||
                selectedMonthlyDate == null
              }
              fullWidth
              leftSection={<Icon icon="mdi:numeric-1-box-multiple" />}
              loading={loading === "userMix"}
              variant="fill"
            >
              Fetch
            </Button>
            <Button
              fullWidth
              disabled={mix == null}
              leftSection={<Icon icon="mdi:music-box" />}
              loading={loading === "songData"}
              variant="light"
            >
              User Mix to Song Data
            </Button>
          </HStack>
          <p.h3>Mix</p.h3>
          <p.div h="100%" overflowX="auto" w="100%">
            <Code block h="300px">
              {JSON.stringify(mix, null, 2)}
            </Code>
          </p.div>
        </VStack>
        <VStack alignItems="start" h="100%" w="100%">
          <p.h3>Mix</p.h3>
          <p.div h="100%" overflowX="auto" w="100%">
            <Code block h="100%">
              {JSON.stringify(mix, null, 2)}
            </Code>
          </p.div>
        </VStack>
      </p.div>
    </VStack>
  );
}
