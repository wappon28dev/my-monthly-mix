import { type ReactElement } from "react";
import { styled as p } from "panda/jsx";
import { MantineProvider, createTheme } from "@mantine/core";
import { M_PLUS_1 } from "next/font/google";
import { siteName, description, url } from "@/lib/info";

import "@mantine/core/styles.css";
import "./global.css";

const font = M_PLUS_1({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

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
      "#f6ecff",
      "#e7d6fb",
      "#caabf1",
      "#ac7ce8",
      "#9354e0",
      "#833cdb",
      "#7b2eda",
      "#6921c2",
      "#5d1cae",
      "#501599",
    ],
  },
  primaryColor: "purple",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <html lang="ja">
      <p.body h={["100vh", "100dvh"]} wordBreak="keep-all">
        <p.main className={font.className} h="100%" w="100%">
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            {children}
          </MantineProvider>
        </p.main>
      </p.body>
    </html>
  );
}
