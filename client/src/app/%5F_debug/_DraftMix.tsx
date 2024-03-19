"use client";

import { HStack, VStack, styled as p } from "panda/jsx";
import { type ReactElement,  useState } from "react";
import { Code, NumberInput } from "@mantine/core";
import { useDraftMix } from "@/hooks/useDraftMix";
import {
  getLocalStorageKey,
  getMonthlyDate,
  monthlyDate2str,
} from "@/lib/utils";

export function DraftMix(): ReactElement {
  const [selectedMonthlyDate, setSelectedMonthlyDate] = useState(
    getMonthlyDate(new Date()),
  );
  const { draftMix } = useDraftMix(selectedMonthlyDate);
  return (
    <VStack
      alignItems="start"
      border="1px solid"
      borderColor="white"
      gap="3"
      h="100%"
      maxH="650px"
      p="3"
    >
      <p.h2 fontSize="2xl" fontWeight="bold">
        User Draft Mix
      </p.h2>
      <p.div
        display="grid"
        gap="3"
        gridTemplateColumns="repeat(auto-fit, minmax(600px, 1fr))"
        h="100%"
        w="100%"
      >
        <VStack alignItems="start" h="100%">
          <p.h3>Select Monthly Date</p.h3>
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
          <p.p>
            Referencing at{" "}
            <p.code>
              {getLocalStorageKey(monthlyDate2str(selectedMonthlyDate))}
            </p.code>
          </p.p>
        </VStack>
        <VStack alignItems="start" h="100%" w="100%">
          <p.h3>Data Preview</p.h3>
          <p.div h="100%" overflowX="auto" w="100%">
            <Code block h="100%">
              {JSON.stringify(draftMix, null, 2)}
            </Code>
          </p.div>
        </VStack>
      </p.div>
    </VStack>
  );
}
