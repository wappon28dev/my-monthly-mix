import { type ReactElement } from "react";
import { styled as p } from "panda/jsx";
import { MantineProvider, createTheme } from "@mantine/core";
import { siteName, description, url } from "@/lib/info";

import "@mantine/core/styles.css";
import "@fontsource-variable/m-plus-1";
import "./global.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  alternates: {
    canonical: url,
  },
};

const theme = createTheme({
  colors: {
    purple: [
      "#faf5ff",
      "#f3e8ff",
      "#e9d5ff",
      "#d8b4fe",
      "#c084fc",
      "#a855f7",
      "#9333ea",
      "#7e22ce",
      "#6b21a8",
      "#581c87",
    ],
  },
  primaryColor: "purple",
  primaryShade: 6,
  fontFamily: "'M PLUS 1 Variable', sans-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <html lang="ja">
      <p.body
        display="grid"
        gridTemplateColumns="100%"
        gridTemplateRows="auto 1fr auto"
        h="100%"
        minHeight="100vh"
        w="100%"
      >
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <Header />
          <p.main h="100%" w="100%">
            {children}
          </p.main>
        </MantineProvider>
      </p.body>
    </html>
  );
}
