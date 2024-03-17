export type ENV = {
  YOUTUBE_DATA_API_KEY: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
};
// eslint-disable-next-line @typescript-eslint/ban-types
export type Variables = {};
export type HonoType = { Bindings: ENV; Variables: Variables };
