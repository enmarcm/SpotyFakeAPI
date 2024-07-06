import { StartServerProps } from "./types";
import picocolors from "picocolors";

export function startServer({ app, PORT }: StartServerProps) {
  app.listen(PORT, () => {
    console.log(
      picocolors.bgBlack(picocolors.green(`SERVER RUNNING ON PORT ${PORT}`))
    );
  });

  return;
}

const DEFAULT_SONG_URL = "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221";

export function replaceInvalidSongUrl(url: string): string {
  if (url.includes("open") || url.includes("spotify")) {
    return DEFAULT_SONG_URL;
  }
  return url;
}
